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

export async function loadOrCreateState(paths: FeaturePaths, artifactMode: ArtifactMode): Promise<WorkflowState> {
  await mkdir(paths.root, { recursive: true });

  try {
    return JSON.parse(await readFile(paths.state, "utf8")) as WorkflowState;
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
