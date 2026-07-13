# ARIA Orchestrator v0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an npm-installable Node/TypeScript CLI that runs the existing ARIA design workflow through Codex, stores resumable feature state under `.aria/<feature>/`, presents material design questions interactively, and enforces phase scope after every runtime call.

**Architecture:** The CLI uses the current directory as its target repository by default. A small static phase catalog mirrors `docs/workflows/design-v1.md`; a Codex adapter executes one phase at a time, while the runner owns transitions, state, questions, approvals, and scope checks. `workflow-state.json` stores only restart-critical workflow metadata; the Design Proposal, Review, and UISpec remain the sources of design intent, evidence, and implementation intent.

**Tech Stack:** Node.js 22+, TypeScript, npm, Node built-in `node:test`, `child_process.spawn`, JSON state files, Git CLI for tracked-change checks.

## Global Constraints

- Keep ARIA focused on design and handoff; do not implement production-code generation, other runtimes, a plugin system, CI mode, or a GUI.
- Expose normal usage as `aria run --feature <slug>` and `aria status --feature <slug>`; `--target` and `--phase` are optional advanced overrides.
- Stop on material open questions, a failed/blocked gate, scope-integrity failure, or human approval.
- Let `aria run` collect approval interactively; do not add `aria approve` in v0.
- Keep all per-feature runtime state under `.aria/<feature>/workflow-state.json`.
- Preserve existing ARIA documents as the workflow authority. Runtime catalog code mirrors the docs; it does not parse Markdown as configuration.
- Do not alter unrelated dirty-worktree files.

---

## File Structure

```text
package.json                         npm package metadata, bin command, scripts
tsconfig.json                        NodeNext TypeScript compilation to dist/
src/bin.ts                           executable entry point and top-level error handling
src/cli/args.ts                      command-line parsing and usage rendering
src/cli/status-view.ts               stable human-readable status output
src/core/types.ts                    phases, state, question, snapshot, and runtime types
src/core/paths.ts                    target, slug, and canonical artifact-path resolution
src/core/state.ts                    workflow-state load, write, and normalization
src/core/questions.ts                restricted fenced-YAML question parser
src/core/phases.ts                   static v0 phase catalog and prerequisite checks
src/core/prompts.ts                  Codex prompt construction from ARIA package docs
src/core/scope-integrity.ts          before/after Git and filesystem snapshot comparison
src/core/runner.ts                   automatic progression, gates, questions, and approval
src/runtime/codex.ts                 Codex availability check and spawned phase execution
test/helpers.ts                      temporary Git repository and fake runtime utilities
test/args.test.ts                    CLI parsing and help behavior
test/paths-state.test.ts             target/slug validation and persisted state behavior
test/questions.test.ts               material-question parsing and answer selection
test/phases.test.ts                  prerequisite, gate, and next-phase behavior
test/scope-integrity.test.ts         allowed versus out-of-scope file changes
test/codex-runtime.test.ts           spawned Codex argument construction with fake executable
test/runner.test.ts                  end-to-end automatic progression, question, and approval flows
docs/architecture.md                 describe the new runtime layer
docs/project-structure.md            add workflow-state.json as target-project runtime metadata
schemas/design-proposal-v1.md        define the fenced-YAML material Open Questions contract
README.md                            document installation, commands, and v0 boundary
```

## Runtime Interfaces

```ts
export type PhaseId =
  | "project-context"
  | "design-proposal"
  | "html-preview"
  | "review"
  | "human-approval"
  | "uispec";

export type ArtifactMode = "trackable" | "local";

export type WorkflowStatus =
  | "ready"
  | "running"
  | "waiting-for-questions"
  | "waiting-for-approval"
  | "failed"
  | "blocked"
  | "complete";

export interface WorkflowState {
  version: 1;
  feature: string;
  artifactMode: ArtifactMode;
  phase: PhaseId;
  status: WorkflowStatus;
  answers: Record<string, string>;
  approvedAt: string | null;
  updatedAt: string;
}

export interface PhaseDefinition {
  id: PhaseId;
  displayName: string;
  prerequisites: readonly string[];
  allowedOutputs: readonly string[];
  requiredOutputs: readonly string[];
  nextPhase: PhaseId | null;
}

export interface RuntimeResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

export interface RuntimeAdapter {
  ensureAvailable(): Promise<void>;
  runPhase(input: {
    targetRoot: string;
    feature: string;
    phase: PhaseDefinition;
    artifactMode: ArtifactMode;
    answers: Record<string, string>;
  }): Promise<RuntimeResult>;
}
```

## Task 1: Scaffold The Installable TypeScript CLI

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/bin.ts`
- Create: `src/cli/args.ts`
- Create: `test/args.test.ts`

**Interfaces:**
- Produces `parseArgs(argv: string[]): ParsedCommand` and `formatUsage(): string`.
- Produces npm command `aria` mapped to `dist/bin.js`.

- [ ] **Step 1: Write failing CLI parse and help tests**

```js
test("parses run with feature and defaults target to cwd", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    artifactMode: "trackable",
  });
});

test("usage documents run and status", () => {
  assert.match(formatUsage(), /aria run --feature <slug>/);
  assert.match(formatUsage(), /aria status --feature <slug>/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="parses run|usage documents"`

Expected: fail because the package and parser do not exist.

- [ ] **Step 3: Add package metadata and TypeScript configuration**

Create `package.json` with `name: "aria-orchestrator"`, `bin: { "aria": "./dist/bin.js" }`, `type: "module"`, `engines.node: ">=22"`, `build`, `test`, and `dev` scripts. Add only `typescript` and `@types/node` as development dependencies. Compile `src/` into `dist/` with NodeNext module settings and strict checking.

- [ ] **Step 4: Implement argument parsing and entry point**

Implement only `run`, `status`, `--feature`, optional `--target`, optional `--phase`, optional `--artifact-mode`, `--help`, and `--version`. Reject unknown options, missing feature values, duplicate options, and unknown commands with exit code `2`. Keep the entry point responsible for printing a concise error and setting a nonzero exit code.

- [ ] **Step 5: Run focused tests and full package checks**

Run: `npm test`

Expected: all CLI parser and help tests pass.

- [ ] **Step 6: Commit the focused scaffold**

```bash
git add package.json package-lock.json tsconfig.json src/bin.ts src/cli/args.ts test/args.test.ts
git commit -m "feat: scaffold ARIA orchestrator CLI"
```

## Task 2: Add Canonical Paths And Minimal Workflow State

**Files:**
- Create: `src/core/types.ts`
- Create: `src/core/paths.ts`
- Create: `src/core/state.ts`
- Create: `test/paths-state.test.ts`

**Interfaces:**
- Produces `resolveTargetRoot(input?: string): Promise<string>`.
- Produces `resolveFeaturePaths(targetRoot: string, feature: string): FeaturePaths`.
- Produces `loadOrCreateState(paths: FeaturePaths, mode: ArtifactMode): Promise<WorkflowState>` and `saveState(paths: FeaturePaths, state: WorkflowState): Promise<void>`.

- [ ] **Step 1: Write failing path and state tests**

```js
test("rejects path-traversal feature slugs", () => {
  assert.throws(() => resolveFeaturePaths(repoRoot, "../escape"), /feature slug/i);
});

test("creates only minimal workflow state under the feature folder", async () => {
  const paths = resolveFeaturePaths(repoRoot, "monitoring-dashboard-v2");
  const state = await loadOrCreateState(paths, "local");
  assert.equal(state.phase, "project-context");
  assert.equal(state.status, "ready");
  assert.deepEqual(Object.keys(state).sort(), [
    "answers", "approvedAt", "artifactMode", "feature", "phase", "status", "updatedAt", "version",
  ]);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="path-traversal|minimal workflow state"`

Expected: fail because path and state modules do not exist.

- [ ] **Step 3: Implement target, slug, artifact, and state behavior**

Resolve the target to `process.cwd()` unless `--target` is supplied. Require a Git repository root. Permit only lowercase kebab-case feature slugs matching `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. Resolve canonical artifact paths only under `<target>/.aria/<feature>/`. Initialize state at `project-context` and update `updatedAt` on every write. Never add target-root, completed-phase, pending-question, or evidence fields.

- [ ] **Step 4: Run focused tests and full package checks**

Run: `npm test`

Expected: all parser, path, and state tests pass.

- [ ] **Step 5: Commit the state foundation**

```bash
git add src/core/types.ts src/core/paths.ts src/core/state.ts test/paths-state.test.ts
git commit -m "feat: persist feature-scoped ARIA workflow state"
```

## Task 3: Define The Static Phase Catalog And Parse Material Questions

**Files:**
- Create: `src/core/phases.ts`
- Create: `src/core/questions.ts`
- Create: `test/phases.test.ts`
- Create: `test/questions.test.ts`
- Modify: `schemas/design-proposal-v1.md`

**Interfaces:**
- Produces `PHASES: readonly PhaseDefinition[]`, `getPhase(id: PhaseId)`, and `assertPhaseEligible(...)`.
- Produces `parseMaterialQuestions(proposalMarkdown: string): MaterialQuestion[]`.

- [ ] **Step 1: Write failing phase and question tests**

```js
test("uispec is ineligible before approval", () => {
  assert.throws(() => assertPhaseEligible("uispec", unapprovedState, paths), /approval/i);
});

test("parses only material questions from the Open Questions YAML fence", () => {
  assert.deepEqual(parseMaterialQuestions(markdown), [{
    id: "data-source",
    prompt: "Which data source should the dashboard use?",
    choices: [{ id: "existing-monitoring-api", label: "Existing monitoring API" }],
  }]);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="uispec is ineligible|parses only material"`

Expected: fail because the catalog and parser do not exist.

- [ ] **Step 3: Implement a fixed six-phase catalog and restricted parser**

Define the six approved phase IDs and their canonical required/allowed outputs. Use a small line-oriented parser for only the documented fenced YAML question shape; reject duplicate IDs, malformed indentation, missing choices, and non-kebab-case IDs. Do not add a general YAML dependency or parser. Update `schemas/design-proposal-v1.md` with the exact material-question fence required by the v0 CLI.

- [ ] **Step 4: Run focused tests and full package checks**

Run: `npm test`

Expected: all phase eligibility and question parser tests pass.

- [ ] **Step 5: Commit catalog and question contract**

```bash
git add src/core/phases.ts src/core/questions.ts test/phases.test.ts test/questions.test.ts schemas/design-proposal-v1.md
git commit -m "feat: add ARIA phase catalog and question gate"
```

## Task 4: Implement The Codex Runtime Adapter And Prompt Builder

**Files:**
- Create: `src/core/prompts.ts`
- Create: `src/runtime/codex.ts`
- Create: `test/codex-runtime.test.ts`

**Interfaces:**
- Produces `buildPhasePrompt(input): string`.
- Produces `CodexRuntime implements RuntimeAdapter`.

- [ ] **Step 1: Write failing adapter tests with a fake executable**

```js
test("runs codex exec in the target without a shell", async () => {
  const result = await runtime.runPhase(input);
  assert.equal(result.exitCode, 0);
  assert.deepEqual(readFakeInvocation(), [
    "exec", "-C", targetRoot, "-s", "workspace-write", "-",
  ]);
});

test("phase prompt names the feature, allowed outputs, and stop boundary", () => {
  const prompt = buildPhasePrompt(input);
  assert.match(prompt, /monitoring-dashboard-v2/);
  assert.match(prompt, /Do not create artifacts from later phases/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="runs codex exec|phase prompt"`

Expected: fail because no Codex adapter exists.

- [ ] **Step 3: Implement availability, spawn, and prompt behavior**

Use `spawn` or `spawnSync` with `shell: false`; never construct a shell command string. Verify `codex --version` before the first runtime call. Pipe the phase prompt to stdin, inherit stdout/stderr for normal CLI use, and collect output for state/error reporting. Build prompts from the installed package root, phase definition, selected answers, artifact mode, and the canonical ARIA docs. Explicitly prohibit later-phase artifacts and production code.

- [ ] **Step 4: Run focused tests and full package checks**

Run: `npm test`

Expected: adapter tests pass without a real Codex invocation.

- [ ] **Step 5: Commit Codex execution support**

```bash
git add src/core/prompts.ts src/runtime/codex.ts test/codex-runtime.test.ts
git commit -m "feat: execute ARIA phases through Codex"
```

## Task 5: Add Scope Integrity Snapshots

**Files:**
- Create: `src/core/scope-integrity.ts`
- Create: `test/helpers.ts`
- Create: `test/scope-integrity.test.ts`

**Interfaces:**
- Produces `captureSnapshot(targetRoot: string): Promise<WorkspaceSnapshot>`.
- Produces `assertScopeIntegrity(before, after, phase, paths): ScopeIntegrityResult`.

- [ ] **Step 1: Write failing scope-integrity tests**

```js
test("accepts a new phase artifact under the allowed feature path", async () => {
  const result = assertScopeIntegrity(before, after, projectContextPhase, paths);
  assert.deepEqual(result.unexpectedPaths, []);
});

test("blocks a source change made during project-context", async () => {
  const result = assertScopeIntegrity(before, after, projectContextPhase, paths);
  assert.deepEqual(result.unexpectedPaths, ["src/page.tsx"]);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="accepts a new phase artifact|blocks a source change"`

Expected: fail because snapshots and scope comparison do not exist.

- [ ] **Step 3: Implement baseline-aware scope checking**

Capture tracked Git changes with `git status --porcelain=v1 --ignored` plus a recursive filesystem inventory rooted at the target repository, excluding `.git/` and `node_modules/`. Compare only paths absent or changed since the before snapshot so unrelated dirty worktree entries do not fail a phase. Accept only the selected phase's allowed outputs under `.aria/<feature>/`; mark all other new or changed paths unexpected. Report exact relative paths.

- [ ] **Step 4: Run focused tests and full package checks**

Run: `npm test`

Expected: scope tests cover tracked, untracked, ignored, baseline, allowed, and blocked paths.

- [ ] **Step 5: Commit scope integrity**

```bash
git add src/core/scope-integrity.ts test/helpers.ts test/scope-integrity.test.ts
git commit -m "feat: enforce ARIA phase scope integrity"
```

## Task 6: Implement Runner, Interactive Gates, And Status

**Files:**
- Create: `src/core/runner.ts`
- Create: `src/cli/status-view.ts`
- Create: `test/runner.test.ts`
- Modify: `src/bin.ts`

**Interfaces:**
- Produces `runWorkflow(options, dependencies): Promise<RunResult>`.
- Produces `renderStatus(state, paths, reviewGate, questions): string`.

- [ ] **Step 1: Write failing runner and status tests**

```js
test("automatically advances context through review then waits for approval", async () => {
  const result = await runWorkflow(options, fakeDependencies);
  assert.equal(result.status, "waiting-for-approval");
  assert.deepEqual(fakeRuntime.phases, ["project-context", "design-proposal", "html-preview", "review"]);
});

test("selecting a material question reruns proposal before preview", async () => {
  const result = await runWorkflow(options, fakeDependencies.withAnswer("existing-monitoring-api"));
  assert.deepEqual(fakeRuntime.phases, ["design-proposal", "design-proposal", "html-preview"]);
});

test("status displays artifacts, gate, and next action", () => {
  assert.match(renderStatus(state, paths, "PASS_WITH_NOTES", []), /Current phase: Human Approval/);
  assert.match(renderStatus(state, paths, "PASS_WITH_NOTES", []), /Next: aria run/);
});
```

- [ ] **Step 2: Run the focused test to verify it fails**

Run: `npm test -- --test-name-pattern="automatically advances|selecting a material|status displays"`

Expected: fail because runner and status view do not exist.

- [ ] **Step 3: Implement automatic progression and interactive decisions**

Run one phase at a time and scope-check every runtime invocation. After Proposal, parse material questions; print numbered choices using `readline/promises`, validate the selected number, write `answers`, and rerun Proposal. After Review, parse the persisted `review.md` gate result; only `PASS` and `PASS_WITH_NOTES` may display the default-no approval prompt. On `y`, persist `approvedAt` and continue to UISpec. On `n`, persist `waiting-for-approval` and exit successfully. On failed/blocked review, persist the state and exit nonzero without trying a later phase. The explicit `--phase` path must validate prerequisites but execute only that phase.

- [ ] **Step 4: Implement status output and wire CLI commands**

Derive completed artifacts from the canonical paths, read the latest review gate if present, list material question IDs, and print exactly one next action. Wire `run` and `status` through `src/bin.ts`; preserve concise, actionable exit messages.

- [ ] **Step 5: Run focused tests and full package checks**

Run: `npm test`

Expected: all unit and temporary-repository integration tests pass.

- [ ] **Step 6: Commit the usable v0 workflow**

```bash
git add src/core/runner.ts src/cli/status-view.ts src/bin.ts test/runner.test.ts
git commit -m "feat: orchestrate ARIA workflow gates"
```

## Task 7: Update Methodology Docs And Verify End To End

**Files:**
- Modify: `README.md`
- Modify: `docs/architecture.md`
- Modify: `docs/project-structure.md`
- Modify: `docs/workflows/design-v1.md`
- Modify: `docs/superpowers/specs/2026-07-13-aria-orchestrator-v0-design.md`

- [ ] **Step 1: Document installation and normal workflow**

Document `npm install`, `npm link`, `aria run --feature <slug>`, `aria status --feature <slug>`, current-directory target resolution, interactive questions, interactive approval, `--phase`, `--target`, and local artifact mode. State that implementation remains outside ARIA v0.

- [ ] **Step 2: Align ARIA methodology with runtime behavior**

Add `workflow-state.json` as operational metadata, state that its fields do not replace design artifacts, and describe automatic progression only through non-human gates. Add the fenced-YAML question shape to the Design Proposal schema and workflow prompt guidance.

- [ ] **Step 3: Run full verification**

Run:

```bash
npm test
npm run build
node dist/bin.js --help
git diff --check
```

Expected: all tests and build exit `0`; help documents `run` and `status`; diff check reports no whitespace errors.

- [ ] **Step 4: Run a manual dry test without a live Codex phase**

Create a temporary Git repository in the test fixture, invoke the compiled CLI with a fake `codex` executable, and verify it creates only `.aria/monitoring-dashboard-v2/` artifacts, waits for questions or approval as appropriate, and blocks an out-of-scope source change.

- [ ] **Step 5: Commit documentation and verification updates**

```bash
git add README.md docs/architecture.md docs/project-structure.md docs/workflows/design-v1.md schemas/design-proposal-v1.md docs/superpowers/specs/2026-07-13-aria-orchestrator-v0-design.md
git commit -m "docs: document ARIA orchestrator workflow"
```
