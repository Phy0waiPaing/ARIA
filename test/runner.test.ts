import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveFeaturePaths } from "../src/core/paths.js";
import { runWorkflow } from "../src/core/runner.js";
import type { RuntimeAdapter, RuntimePhaseInput, RuntimeResult } from "../src/core/types.js";

const QUESTION_FENCE = `### Material Questions (CLI)

\`\`\`yaml
questions:
  - id: data-source
    material: true
    prompt: Which data source should the dashboard use?
    choices:
      - id: existing-monitoring-api
        label: Existing monitoring API
\`\`\`
`;

class FakeRuntime implements RuntimeAdapter {
  readonly phases: string[] = [];

  constructor(private readonly includeQuestion = false) {}

  async ensureAvailable(): Promise<void> {}

  async runPhase(input: RuntimePhaseInput): Promise<RuntimeResult> {
    this.phases.push(input.phase.id);
    const root = path.join(input.targetRoot, ".aria", input.feature);
    await mkdir(path.join(root, "preview"), { recursive: true });

    switch (input.phase.id) {
      case "project-context":
        await writeFile(path.join(root, "project-context.md"), "# Context\n");
        break;
      case "design-proposal":
        await writeFile(path.join(root, "design-proposal.md"), input.answers["data-source"] ? "# Proposal\n" : `# Proposal\n\n${this.includeQuestion ? QUESTION_FENCE : ""}`);
        break;
      case "html-preview":
        await writeFile(path.join(root, "preview", "index.html"), "<!doctype html>\n");
        await writeFile(path.join(root, "preview", "styles.css"), "body {}\n");
        break;
      case "review":
        await writeFile(path.join(root, "review.md"), "# Review\n\nGate: PASS_WITH_NOTES\n");
        break;
      case "uispec":
        await writeFile(path.join(root, "target.uispec.md"), "# UISpec\n");
        break;
      case "human-approval":
        break;
    }

    return { exitCode: 0, stdout: "", stderr: "" };
  }
}

async function createTarget(): Promise<string> {
  const target = await mkdtemp(path.join(os.tmpdir(), "aria-runner-"));
  execFileSync("git", ["init"], { cwd: target, stdio: "ignore" });
  return target;
}

test("automatically advances context through preview then waits for human preview review", async () => {
  const targetRoot = await createTarget();
  const runtime = new FakeRuntime();
  const result = await runWorkflow({
    targetRoot,
    feature: "monitoring-dashboard-v2",
  }, {
    runtime,
    requestApproval: async () => false,
  });

  assert.equal(result.status, "waiting-for-preview-review");
  assert.deepEqual(runtime.phases, ["project-context", "design-proposal", "html-preview"]);
  assert.equal(result.state.phase, "review");
  assert.match(result.message, /HTML Preview ready/);
});

test("continues to review and approval after human preview review", async () => {
  const targetRoot = await createTarget();
  const runtime = new FakeRuntime();

  await runWorkflow({
    targetRoot,
    feature: "monitoring-dashboard-v2",
  }, {
    runtime,
    requestApproval: async () => false,
  });

  const result = await runWorkflow({
    targetRoot,
    feature: "monitoring-dashboard-v2",
  }, {
    runtime,
    requestApproval: async () => false,
  });

  assert.equal(result.status, "waiting-for-approval");
  assert.deepEqual(runtime.phases, ["project-context", "design-proposal", "html-preview", "review"]);
  assert.equal(result.state.phase, "human-approval");
});

test("selecting a material question reruns proposal before preview", async () => {
  const targetRoot = await createTarget();
  const runtime = new FakeRuntime(true);
  const result = await runWorkflow({
    targetRoot,
    feature: "monitoring-dashboard-v2",
  }, {
    runtime,
    selectQuestion: async () => "existing-monitoring-api",
    requestApproval: async () => false,
  });

  assert.equal(result.status, "waiting-for-preview-review");
  assert.deepEqual(runtime.phases.slice(0, 3), ["project-context", "design-proposal", "design-proposal"]);
  assert.equal(result.state.answers["data-source"], "existing-monitoring-api");
});

test("status displays artifacts, gate, and next action", async () => {
  const targetRoot = await createTarget();
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  await mkdir(paths.root, { recursive: true });
  await writeFile(paths.review, "Gate: PASS_WITH_NOTES\n");
  const { renderStatus } = await import("../src/cli/status-view.js");

  const output = renderStatus({
    version: 1,
    feature: "monitoring-dashboard-v2",
    artifactMode: "trackable",
    phase: "human-approval",
    status: "waiting-for-approval",
    answers: {},
    approvedAt: null,
    updatedAt: "2026-07-13T00:00:00.000Z",
  }, paths, "PASS_WITH_NOTES", []);

  assert.match(output, /Current phase: Human Approval/);
  assert.match(output, /Next: aria run/);
});

test("status explains the preview-review pause", async () => {
  const targetRoot = await createTarget();
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  const { renderStatus } = await import("../src/cli/status-view.js");

  const output = renderStatus({
    version: 1,
    feature: "monitoring-dashboard-v2",
    artifactMode: "trackable",
    phase: "review",
    status: "waiting-for-preview-review",
    answers: {},
    approvedAt: null,
    updatedAt: "2026-07-13T00:00:00.000Z",
  }, paths, undefined, []);

  assert.match(output, /Status: waiting-for-preview-review/);
  assert.match(output, /review the HTML Preview/);
});
