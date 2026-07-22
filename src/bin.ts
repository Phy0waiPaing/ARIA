#!/usr/bin/env node

import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CliUsageError, formatUsage, parseArgs } from "./cli/args.js";
import { renderStatus } from "./cli/status-view.js";
import { formatDoctorReport, runDoctor } from "./core/doctor.js";
import { PHASES } from "./core/phases.js";
import { resolveArtifactMode, resolveFeaturePaths, resolveTargetRoot } from "./core/paths.js";
import { parseMaterialQuestions } from "./core/questions.js";
import { readReviewGate, runWorkflow } from "./core/runner.js";
import { loadOrCreateState, recordRevisionRequest, setRequirementBrief } from "./core/state.js";
import type { MaterialQuestion, PhaseDefinition, PhaseId } from "./core/types.js";
import { ReleaseManager } from "./core/release.js";
import { CodexRuntime } from "./runtime/codex.js";

function packageRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
}

function phaseId(value: string | undefined): PhaseId | undefined {
  if (value === undefined) return undefined;
  if (!PHASES.some((phase) => phase.id === value)) {
    throw new CliUsageError(`Unknown phase: ${value}`);
  }
  return value as PhaseId;
}

async function chooseQuestion(question: MaterialQuestion): Promise<string | undefined> {
  console.log(`\n${question.prompt}`);
  question.choices.forEach((choice, index) => console.log(`  ${index + 1}. ${choice.label} (${choice.id})`));
  const readline = createInterface({ input, output });
  try {
    const answer = (await readline.question("Choose an option number, or press Enter to pause: ")).trim();
    if (!answer) return undefined;
    const selected = question.choices[Number(answer) - 1];
    if (!selected) throw new Error("Choose one of the listed option numbers.");
    return selected.id;
  } finally {
    readline.close();
  }
}

async function requestApproval(gate: "PASS" | "PASS_WITH_NOTES"): Promise<boolean> {
  const readline = createInterface({ input, output });
  try {
    const answer = (await readline.question(`Review gate: ${gate}. Approve proposal and compile UISpec? [y/N] `)).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    readline.close();
  }
}

async function requestUninstall(): Promise<boolean> {
  const readline = createInterface({ input, output });
  try {
    const answer = (await readline.question("Remove the global ARIA CLI? [y/N] ")).trim().toLowerCase();
    return answer === "y" || answer === "yes";
  } finally {
    readline.close();
  }
}

function createPhaseReporter(modelLabel: string, verbose: boolean): {
  onPhaseStart: (phase: PhaseDefinition) => void;
  onPhaseEnd: (phase: PhaseDefinition) => void;
} {
  let timer: NodeJS.Timeout | undefined;
  let activePhase: string | undefined;
  let tick = 0;

  function clearProgressLine(): void {
    if (process.stdout.isTTY) {
      process.stdout.write(`\r${" ".repeat(90)}\r`);
    }
  }

  return {
    onPhaseStart(phase) {
      activePhase = phase.displayName;
      tick = 0;
      console.log(`Running ${phase.displayName} with Codex model ${modelLabel}...`);
      if (verbose || !process.stdout.isTTY) return;

      timer = setInterval(() => {
        tick += 1;
        const dots = ".".repeat((tick % 3) + 1).padEnd(3, " ");
        process.stdout.write(`\rStill running ${activePhase}${dots}`);
      }, 1000);
    },
    onPhaseEnd(phase) {
      if (timer !== undefined) {
        clearInterval(timer);
        timer = undefined;
        clearProgressLine();
      }
      console.log(`Completed ${phase.displayName}.`);
      activePhase = undefined;
    },
  };
}

async function main(argv: string[]): Promise<void> {
  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h")) {
    console.log(formatUsage());
    return;
  }
  if (argv.length === 1 && argv[0] === "--version") {
    console.log("0.1.0");
    return;
  }

  try {
    const command = parseArgs(argv);

    if (command.command === "upgrade") {
      const result = await new ReleaseManager().upgrade();
      if (result.exitCode === 0) {
        console.log("ARIA upgraded from the release branch.");
      } else {
        process.exitCode = result.exitCode;
      }
      return;
    }

    if (command.command === "uninstall") {
      if (!await requestUninstall()) {
        console.log("ARIA uninstall cancelled.");
        return;
      }
      const result = await new ReleaseManager().uninstall();
      if (result.exitCode === 0) {
        console.log("ARIA has been removed from global npm packages.");
      } else {
        process.exitCode = result.exitCode;
      }
      return;
    }

    if (command.command === "doctor") {
      const report = await runDoctor({
        targetInput: command.target,
        packageRoot: packageRoot(),
        runtime: new CodexRuntime(),
      });
      console.log(command.json ? JSON.stringify(report, null, 2) : formatDoctorReport(report));
      if (command.strict && report.status !== "ok") process.exitCode = 1;
      return;
    }

    if (command.feature === undefined) {
      throw new CliUsageError("--feature is required");
    }
    const targetRoot = await resolveTargetRoot(command.target);
    const paths = resolveFeaturePaths(targetRoot, command.feature);
    const artifactMode = await resolveArtifactMode(targetRoot, paths);
    let state = await loadOrCreateState(paths, artifactMode, true);

    if (command.command === "status") {
      const proposal = await import("node:fs/promises").then(({ readFile }) => readFile(paths.proposal, "utf8").catch(() => ""));
      console.log(renderStatus(state, paths, await readReviewGate(paths), parseMaterialQuestions(proposal)));
      return;
    }

    const model = command.model ?? process.env.ARIA_MODEL;
    const modelLabel = model ?? "Codex config default";
    const phaseReporter = createPhaseReporter(modelLabel, command.verbose);

    if (command.command === "run" && command.brief !== undefined) {
      state = await setRequirementBrief(paths, state, command.brief);
      if (state.phase !== "project-context") {
        console.log("Updated requirement brief. Existing completed phases are not reset automatically; use revise for design changes after preview.");
      }
    }

    if (command.command === "revise") {
      state = await recordRevisionRequest(paths, state, command.message!);
      console.log("Recorded revision request. Returning to Design Proposal and re-rendering the preview.");
    }

    const run = await runWorkflow({
      targetRoot,
      feature: command.feature,
      phase: phaseId(command.phase),
    }, {
      runtime: new CodexRuntime({ model, verbose: command.verbose }),
      selectQuestion: chooseQuestion,
      requestApproval,
      onPhaseStart: phaseReporter.onPhaseStart,
      onPhaseEnd: phaseReporter.onPhaseEnd,
    });
    console.log(run.message);
    if (run.status === "failed" || run.status === "blocked") process.exitCode = 1;
  } catch (error) {
    if (error instanceof CliUsageError) {
      console.error(error.message);
      console.error(formatUsage());
      process.exitCode = 2;
      return;
    }

    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  }
}

void main(process.argv.slice(2));
