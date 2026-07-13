import assert from "node:assert/strict";
import test from "node:test";

import { assertPhaseEligible, getPhase } from "../src/core/phases.js";
import { resolveFeaturePaths } from "../src/core/paths.js";
import type { WorkflowState } from "../src/core/types.js";

const paths = resolveFeaturePaths("C:/repo", "monitoring-dashboard-v2");

const unapprovedState: WorkflowState = {
  version: 1,
  feature: "monitoring-dashboard-v2",
  artifactMode: "local",
  phase: "uispec",
  status: "ready",
  answers: {},
  approvedAt: null,
  updatedAt: "2026-07-13T00:00:00.000Z",
};

test("uispec is ineligible before approval", () => {
  assert.throws(() => assertPhaseEligible("uispec", unapprovedState, paths), /approval/i);
});

test("returns each phase from the static catalog", () => {
  assert.equal(getPhase("html-preview").nextPhase, "review");
  assert.deepEqual(getPhase("review").requiredOutputs, ["review.md"]);
});
