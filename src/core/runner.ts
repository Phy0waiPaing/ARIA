import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { getPhase, assertPhaseEligible } from "./phases.js";
import { assertArtifactMode, resolveFeaturePaths } from "./paths.js";
import { parseMaterialQuestions } from "./questions.js";
import { assertScopeIntegrity, captureSnapshot } from "./scope-integrity.js";
import { loadOrCreateState, saveState } from "./state.js";
import type {
  ArtifactMode,
  FeaturePaths,
  MaterialQuestion,
  PhaseId,
  RuntimeAdapter,
  ScopeIntegrityResult,
  WorkflowState,
  WorkspaceSnapshot,
} from "./types.js";

export type ReviewGate = "PASS" | "PASS_WITH_NOTES" | "FAIL" | "BLOCKED";

export interface RunWorkflowOptions {
  targetRoot: string;
  feature: string;
  artifactMode: ArtifactMode;
  phase?: PhaseId;
}

export interface WorkflowDependencies {
  runtime: RuntimeAdapter;
  selectQuestion?: (question: MaterialQuestion) => Promise<string | undefined>;
  requestApproval?: (gate: "PASS" | "PASS_WITH_NOTES") => Promise<boolean>;
  captureSnapshot?: (targetRoot: string) => Promise<WorkspaceSnapshot>;
  assertScopeIntegrity?: (
    before: WorkspaceSnapshot,
    after: WorkspaceSnapshot,
    phase: ReturnType<typeof getPhase>,
    paths: FeaturePaths,
  ) => ScopeIntegrityResult;
}

export interface RunResult {
  state: WorkflowState;
  status: WorkflowState["status"];
  message: string;
}

function nextState(state: WorkflowState, phase: PhaseId, status: WorkflowState["status"]): WorkflowState {
  return { ...state, phase, status };
}

function requiredPath(paths: FeaturePaths, output: string): string {
  return path.join(paths.root, ...output.split("/"));
}

async function assertRequiredOutputs(paths: FeaturePaths, phase: ReturnType<typeof getPhase>): Promise<void> {
  for (const output of phase.requiredOutputs) {
    try {
      await access(requiredPath(paths, output));
    } catch {
      throw new Error(`Phase ${phase.id} did not produce required artifact: .aria/${paths.feature}/${output}`);
    }
  }
}

export async function readReviewGate(paths: FeaturePaths): Promise<ReviewGate | undefined> {
  try {
    const review = await readFile(paths.review, "utf8");
    const match = review.match(/\bGate:\s*(PASS_WITH_NOTES|PASS|FAIL|BLOCKED)\b/);
    return match?.[1] as ReviewGate | undefined;
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return undefined;
    throw error;
  }
}

async function persist(paths: FeaturePaths, state: WorkflowState): Promise<WorkflowState> {
  await saveState(paths, state);
  return { ...state, updatedAt: new Date().toISOString() };
}

function result(state: WorkflowState, message: string): RunResult {
  return { state, status: state.status, message };
}

export async function runWorkflow(options: RunWorkflowOptions, dependencies: WorkflowDependencies): Promise<RunResult> {
  const paths = resolveFeaturePaths(options.targetRoot, options.feature);
  let state = await loadOrCreateState(paths, options.artifactMode);
  await assertArtifactMode(options.targetRoot, paths, state.artifactMode);
  const onlySelectedPhase = options.phase !== undefined;
  const snapshot = dependencies.captureSnapshot ?? captureSnapshot;
  const verifyScope = dependencies.assertScopeIntegrity ?? assertScopeIntegrity;
  let runtimeChecked = false;

  if (options.phase !== undefined) {
    assertPhaseEligible(options.phase, state, paths);
  }

  while (true) {
    const phase = getPhase(state.phase);

    if (phase.id === "human-approval") {
      const gate = await readReviewGate(paths);
      if (gate === undefined || gate === "BLOCKED") {
        state = await persist(paths, nextState(state, "review", "blocked"));
        return result(state, "Review evidence is missing or blocked. Re-run Review after resolving it.");
      }
      if (gate === "FAIL") {
        state = await persist(paths, nextState(state, "review", "failed"));
        return result(state, "Review failed. Revise the proposal and preview, then re-run Review.");
      }

      const approved = dependencies.requestApproval ? await dependencies.requestApproval(gate) : false;
      if (!approved) {
        state = await persist(paths, nextState(state, "human-approval", "waiting-for-approval"));
        return result(state, "Waiting for human approval.");
      }

      state = await persist(paths, {
        ...state,
        phase: "uispec",
        status: "running",
        approvedAt: new Date().toISOString(),
      });
      if (onlySelectedPhase) return result(state, "Approval recorded. Run again to compile the UISpec.");
      continue;
    }

    assertPhaseEligible(phase.id, state, paths);
    if (!runtimeChecked) {
      await dependencies.runtime.ensureAvailable();
      runtimeChecked = true;
    }

    state = await persist(paths, nextState(state, phase.id, "running"));
    const before = await snapshot(options.targetRoot);
    const runtimeResult = await dependencies.runtime.runPhase({
      targetRoot: options.targetRoot,
      feature: options.feature,
      phase,
      artifactMode: state.artifactMode,
      answers: state.answers,
    });
    const after = await snapshot(options.targetRoot);
    const scope = verifyScope(before, after, phase, paths);

    if (scope.unexpectedPaths.length > 0) {
      state = await persist(paths, nextState(state, phase.id, "blocked"));
      return result(state, `Scope integrity blocked this phase: ${scope.unexpectedPaths.join(", ")}`);
    }
    if (runtimeResult.exitCode !== 0) {
      state = await persist(paths, nextState(state, phase.id, "failed"));
      return result(state, `Codex failed during ${phase.displayName}: ${runtimeResult.stderr || runtimeResult.stdout || `exit ${runtimeResult.exitCode}`}`);
    }

    try {
      await assertRequiredOutputs(paths, phase);
    } catch (error) {
      state = await persist(paths, nextState(state, phase.id, "failed"));
      return result(state, error instanceof Error ? error.message : "Required artifact is missing.");
    }

    if (phase.id === "design-proposal") {
      const proposal = await readFile(paths.proposal, "utf8");
      const questions = parseMaterialQuestions(proposal).filter((question) => state.answers[question.id] === undefined);
      if (questions.length > 0) {
        const question = questions[0]!;
        const selected = dependencies.selectQuestion ? await dependencies.selectQuestion(question) : undefined;
        if (selected === undefined) {
          state = await persist(paths, nextState(state, "design-proposal", "waiting-for-questions"));
          return result(state, `Waiting for an answer to: ${question.id}`);
        }
        if (!question.choices.some((choice) => choice.id === selected)) {
          throw new Error(`Invalid answer for ${question.id}: ${selected}`);
        }
        state = await persist(paths, {
          ...state,
          phase: "design-proposal",
          status: "ready",
          answers: { ...state.answers, [question.id]: selected },
        });
        if (onlySelectedPhase) return result(state, `Answer recorded for ${question.id}. Run again to regenerate the proposal.`);
        continue;
      }
    }

    if (phase.id === "review") {
      const gate = await readReviewGate(paths);
      if (gate === undefined || gate === "BLOCKED") {
        state = await persist(paths, nextState(state, "review", "blocked"));
        return result(state, "Review did not provide a usable gate result.");
      }
      if (gate === "FAIL") {
        state = await persist(paths, nextState(state, "review", "failed"));
        return result(state, "Review failed. Revise the proposal and preview before retrying.");
      }
    }

    const next = phase.nextPhase;
    if (next === null) {
      state = await persist(paths, nextState(state, phase.id, "complete"));
      return result(state, `Design package complete: ${paths.targetUispec}`);
    }

    state = await persist(paths, nextState(state, next, "ready"));
    if (onlySelectedPhase) return result(state, `Completed ${phase.displayName}. Next phase: ${getPhase(next).displayName}.`);
  }
}
