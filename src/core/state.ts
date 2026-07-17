import { mkdir, readFile, writeFile } from "node:fs/promises";

import type { ArtifactMode, FeaturePaths, WorkflowState } from "./types.js";

function initialState(feature: string, artifactMode: ArtifactMode): WorkflowState {
  return {
    version: 1,
    feature,
    artifactMode,
    phase: "project-context",
    status: "ready",
    answers: {},
    approvedAt: null,
    updatedAt: new Date().toISOString(),
  };
}

export async function loadOrCreateState(
  paths: FeaturePaths,
  artifactMode: ArtifactMode,
  updateArtifactMode = false,
): Promise<WorkflowState> {
  await mkdir(paths.root, { recursive: true });

  try {
    const state = JSON.parse(await readFile(paths.state, "utf8")) as WorkflowState;
    if (!updateArtifactMode || state.artifactMode === artifactMode) return state;

    const updatedState = { ...state, artifactMode };
    await saveState(paths, updatedState);
    return updatedState;
  } catch (error: unknown) {
    if (!(error instanceof Error) || !("code" in error) || error.code !== "ENOENT") {
      throw error;
    }

    const state = initialState(paths.feature, artifactMode);
    await saveState(paths, state);
    return state;
  }
}

export async function saveState(paths: FeaturePaths, state: WorkflowState): Promise<void> {
  const next = { ...state, updatedAt: new Date().toISOString() };
  await mkdir(paths.root, { recursive: true });
  await writeFile(paths.state, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

export async function setRequirementBrief(paths: FeaturePaths, state: WorkflowState, brief: string): Promise<WorkflowState> {
  const next = {
    ...state,
    requirementBrief: brief,
    approvedAt: null,
  };
  await saveState(paths, next);
  return next;
}

export async function recordRevisionRequest(paths: FeaturePaths, state: WorkflowState, message: string): Promise<WorkflowState> {
  const next = {
    ...state,
    phase: "design-proposal" as const,
    status: "ready" as const,
    approvedAt: null,
    revisionRequests: [
      ...(state.revisionRequests ?? []),
      { createdAt: new Date().toISOString(), message },
    ],
  };
  await saveState(paths, next);
  return next;
}
