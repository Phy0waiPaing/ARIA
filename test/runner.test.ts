import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveFeaturePaths } from "../src/core/paths.js";
import { runWorkflow } from "../src/core/runner.js";
import { DEFAULT_REVISION_LIMIT, loadOrCreateState, recordRevisionRequest, setRequirementBrief } from "../src/core/state.js";
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
  readonly briefs: Array<string | undefined> = [];
  readonly revisions: number[] = [];

  constructor(private readonly includeQuestion = false) {}

  async ensureAvailable(): Promise<void> {}

  async runPhase(input: RuntimePhaseInput): Promise<RuntimeResult> {
    this.phases.push(input.phase.id);
    this.briefs.push(input.requirementBrief);
    this.revisions.push(input.revisionRequests?.length ?? 0);
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

    return { exitCode: 0, stdout: `stdout ${input.phase.id}`, stderr: `stderr ${input.phase.id}` };
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

test("records workflow events and raw phase logs", async () => {
  const targetRoot = await createTarget();
  const runtime = new FakeRuntime();
  const result = await runWorkflow({
    targetRoot,
    feature: "monitoring-dashboard-v2",
    modelLabel: "test-model",
  }, {
    runtime,
    requestApproval: async () => false,
  });
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  const events = (await readFile(paths.events, "utf8"))
    .trim()
    .split(/\r?\n/)
    .map((line) => JSON.parse(line) as { event: string; phase?: string; raw?: { stdout: string } });
  const rawFiles = await readdir(paths.raw);
  const usage = JSON.parse(await readFile(paths.usage, "utf8")) as {
    status: string;
    coverage: string;
    invocations: Array<{ phase: string; model: string; raw: { stdout: string } }>;
  };

  assert.equal(result.status, "waiting-for-preview-review");
  assert.deepEqual(events.map((event) => event.event), [
    "phase_started",
    "phase_completed",
    "phase_started",
    "phase_completed",
    "phase_started",
    "phase_completed",
    "preview_waiting",
  ]);
  assert.equal(events.filter((event) => event.event === "phase_completed").length, 3);
  assert.equal(rawFiles.length, 6);
  assert.equal(usage.status, "partial");
  assert.equal(usage.coverage, "unavailable");
  assert.deepEqual(usage.invocations.map((invocation) => invocation.phase), ["project-context", "design-proposal", "html-preview"]);
  assert.deepEqual([...new Set(usage.invocations.map((invocation) => invocation.model))], ["test-model"]);
  const firstStdout = events.find((event) => event.event === "phase_completed")?.raw?.stdout;
  assert.ok(firstStdout);
  assert.match(await readFile(path.join(paths.root, firstStdout), "utf8"), /stdout project-context/);
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

test("revision request returns to proposal and rerenders preview", async () => {
  const targetRoot = await createTarget();
  const paths = resolveFeaturePaths(targetRoot, "role-crud-v2");
  let state = await loadOrCreateState(paths, "trackable", true);
  state = await setRequirementBrief(paths, state, "Create role only needs a name for now. Permissions come later.");
  state = await recordRevisionRequest(paths, state, "Preview is too decorative; match SVMP admin density.");

  const runtime = new FakeRuntime();
  const result = await runWorkflow({
    targetRoot,
    feature: "role-crud-v2",
  }, {
    runtime,
    requestApproval: async () => false,
  });

  assert.equal(result.status, "waiting-for-preview-review");
  assert.deepEqual(runtime.phases, ["design-proposal", "html-preview"]);
  assert.equal(runtime.briefs[0], "Create role only needs a name for now. Permissions come later.");
  assert.deepEqual(runtime.revisions, [1, 1]);
});

test("revision requests stop at the default limit unless extra iteration is authorized", async () => {
  const targetRoot = await createTarget();
  const paths = resolveFeaturePaths(targetRoot, "role-crud-v2");
  let state = await loadOrCreateState(paths, "trackable", true);
  for (let index = 0; index < DEFAULT_REVISION_LIMIT; index += 1) {
    state = await recordRevisionRequest(paths, state, `Revision ${index + 1}`);
  }

  await assert.rejects(
    () => recordRevisionRequest(paths, state, "One more"),
    /Revision limit reached/,
  );

  const continued = await recordRevisionRequest(paths, state, "One more", { allowExtra: true });
  assert.equal(continued.revisionRequests?.length, DEFAULT_REVISION_LIMIT + 1);
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
  assert.match(output, /events\.jsonl/);
  assert.match(output, /usage\.json/);
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
