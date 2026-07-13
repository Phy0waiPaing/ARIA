import assert from "node:assert/strict";
import { mkdtemp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveFeaturePaths } from "../src/core/paths.js";
import { loadOrCreateState } from "../src/core/state.js";

test("rejects path-traversal feature slugs", () => {
  assert.throws(() => resolveFeaturePaths("C:/repo", "../escape"), /feature slug/i);
});

test("creates only minimal workflow state under the feature folder", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-paths-"));
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  const state = await loadOrCreateState(paths, "local");

  assert.equal(state.phase, "project-context");
  assert.equal(state.status, "ready");
  assert.deepEqual(Object.keys(state).sort(), [
    "answers",
    "approvedAt",
    "artifactMode",
    "feature",
    "phase",
    "status",
    "updatedAt",
    "version",
  ]);
  assert.equal(paths.state, path.join(targetRoot, ".aria", "monitoring-dashboard-v2", "workflow-state.json"));
});
