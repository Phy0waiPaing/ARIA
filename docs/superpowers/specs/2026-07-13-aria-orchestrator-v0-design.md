# ARIA Orchestrator v0 Design

**Goal:** Turn ARIA's documented manual workflow into a local CLI that invokes Codex phase by phase, persists feature-scoped workflow state, asks humans to resolve material design questions, and stops at approval gates.

**Status:** Implemented v0 baseline.

## Product Boundary

ARIA v0 is a design-workflow orchestrator, not an AI designer, general-purpose workflow engine, or production-code generator.

ARIA owns:

- Phase definitions and allowed transitions.
- Artifact location and phase-boundary enforcement.
- Design and review policy loading.
- Workflow-state persistence.
- Interactive open-question and approval gates.

Codex is the only v0 runtime. It reads the target repository, creates phase artifacts, and later implements approved UISpecs outside ARIA's pre-development loop.

## User Experience

The normal command is intentionally small:

```powershell
aria run --feature monitoring-dashboard-v2
```

ARIA uses the current directory as the target repository. `--target <path>` remains an optional override for scripts and CI.

`run` resumes the named feature from its saved state and advances through eligible phases:

```text
Project Context
  -> Design Proposal
  -> HTML Preview
  -> Review
  -> Human Approval
  -> UISpec
```

The runner stops only when it encounters:

- A material open question that needs a user choice.
- A failed or blocked phase gate.
- The mandatory Human Approval gate.
- A scope-integrity failure.

`--phase <name>` is an advanced control for retrying or testing a specific phase. It never bypasses prerequisite gates.

## Commands

```text
aria run --feature <slug> [--phase <phase>] [--target <path>] [--artifact-mode trackable|local]
aria status --feature <slug> [--target <path>]
```

`aria run` is interactive by default. A non-interactive answer command is deliberately out of scope for v0; it can be added later for CI or scripting.

### Run

1. Resolve the target repository from `--target` or `process.cwd()`.
2. Resolve `.aria/<slug>/` inside that repository.
3. Load or initialize workflow state.
4. Determine the next eligible phase, or validate the explicit `--phase` request.
5. Build a phase-scoped prompt from the existing ARIA workflow, prompts, schemas, and policies.
6. Invoke `codex exec -C <target>` and stream its output.
7. Run the scope-integrity check.
8. Persist the resulting state, then either continue or stop at the next gate.

### Open Questions

The Design Proposal's existing Open Questions section becomes machine-readable for v0. It contains this fenced YAML block whenever material questions remain:

```yaml
questions:
  - id: data-source
    material: true
    prompt: Which data source should the dashboard use?
    choices:
      - id: existing-monitoring-api
        label: Existing monitoring API
      - id: new-aggregation-endpoint
        label: New aggregation endpoint
      - id: mock-data
        label: Manual mock data for the design spike
```

Question IDs and choice IDs use lowercase kebab-case. `material: true` means ARIA must pause; non-material notes remain ordinary prose and do not enter workflow state.

When unresolved material questions exist, `aria run` prints numbered choices and waits for terminal input. It records the answer in workflow state, reruns the Design Proposal phase to update the human-facing artifact, and resumes automatic progression only after the proposal no longer has material unresolved questions.

Workflow state records the answer as execution metadata. The updated Design Proposal remains the source of human-approved design intent.

### Approval

After Review returns `PASS` or `PASS_WITH_NOTES`, `aria run` pauses and presents:

```text
Review passed. Approve this design and compile the UISpec? [y/N]
```

`y` validates that the latest review is eligible, records approval in workflow state, and continues to UISpec compilation. `n` leaves the feature waiting for approval; a later `aria run --feature <slug>` presents the same choice again.

This is an explicit, auditable approval event even though it does not require a second command. A non-interactive `aria approve` command is deferred until there is a scripting or CI use case.

### Status

`aria status --feature <slug>` provides the workflow at a glance. Its output includes:

```text
Feature: monitoring-dashboard-v2
Artifact mode: local
Current phase: Human Approval
Status: waiting-for-approval
Review gate: PASS_WITH_NOTES

Artifacts:
- .aria/monitoring-dashboard-v2/project-context.md
- .aria/monitoring-dashboard-v2/design-proposal.md
- .aria/monitoring-dashboard-v2/preview/
- .aria/monitoring-dashboard-v2/review.md
- .aria/monitoring-dashboard-v2/target.uispec.md

Next: aria run --feature monitoring-dashboard-v2
```

When material open questions exist, Status lists their IDs and reports that `aria run` will present their choices.

## Feature Artifact Structure

The existing feature-centric layout remains canonical:

```text
.aria/<feature>/
  workflow-state.json
  project-context.md
  design-proposal.md
  preview/
    index.html
    styles.css
    interactions.js
  review.md
  current.uispec.md
  target.uispec.md
  work-contracts/
  design-package/
```

`workflow-state.json` is the only new v0 artifact. It stores workflow mechanics, not product or design intent.

Its initial fields are:

```json
{
  "version": 1,
  "feature": "monitoring-dashboard-v2",
  "artifactMode": "local",
  "phase": "design-proposal",
  "status": "waiting-for-questions",
  "answers": {},
  "approvedAt": null,
  "updatedAt": "2026-07-13T00:00:00.000Z"
}
```

Completed phases are derived from the current phase and the canonical artifact paths. Pending questions are parsed from the current Design Proposal. Review evidence remains in `review.md`. Timestamps are operational metadata only. Feature slugs, not timestamps, identify normal reruns. A rerun updates the same feature folder and Git can preserve history when artifacts are trackable.

## Phase Contract And Gates

The CLI reuses `docs/workflows/design-v1.md` as the product workflow source. For v0 code, phase metadata is represented in a small runtime catalog that mirrors the documented phases rather than parsing Markdown as executable configuration.

Each runtime phase defines:

- Prerequisites.
- Allowed artifact outputs.
- Codex prompt inputs.
- Completion evidence.
- Next automatic phase.
- Stop or gate condition.

The initial behavior is:

| Phase | Runtime behavior | Next action |
| --- | --- | --- |
| Project Context | Invoke Codex and require `project-context.md`. | Proposal. |
| Design Proposal | Invoke Codex and require `design-proposal.md`. | Ask questions, or Preview. |
| HTML Preview | Invoke Codex and require preview outputs. | Review. |
| Review | Invoke Codex and require `review.md`. | Approval for PASS/PASS_WITH_NOTES; retry for FAIL/BLOCKED. |
| Human Approval | Prompt in the terminal after an eligible Review. | `y` unlocks UISpec; `n` stops. |
| UISpec | Invoke Codex only after approval and require `target.uispec.md`. | Stop; Codex implementation remains outside v0. |

## Codex Runtime Adapter

The Codex adapter is responsible only for runtime execution:

1. Verify `codex` is available on `PATH` with `codex --version`.
2. Build a phase-specific prompt that names the target root, feature slug, artifact mode, allowed outputs, forbidden outputs, and required stop behavior.
3. Spawn `codex exec -C <targetRoot> -s workspace-write -` without a shell, stream terminal output, and retain it for error reporting.
4. Return the process exit status and captured execution metadata to the runner.

The prompt references the installed ARIA package's workflow documents by absolute package path. This preserves ARIA as the workflow authority while letting Codex operate in the target repository.

No generic runtime plugin framework is included in v0. The adapter boundary is a focused interface so a second runtime can be added later without changing phase logic.

## Scope Integrity Check

Codex has workspace-level write access, so v0 cannot preemptively constrain it to one artifact directory. Instead, ARIA detects violations immediately after each runtime invocation.

Before each phase, the runner captures a repository snapshot. After Codex exits, it compares:

- Tracked-file changes through Git.
- Untracked and ignored filesystem entries.
- Expected artifact outputs for the selected phase.

The phase fails if it detects a new or changed path outside the current phase's allowed outputs, excluding changes that already existed in the pre-phase snapshot. It preserves the blocked phase in workflow state, reports the unexpected paths, and requires user intervention before a retry.

For v0, Scope Integrity means file and phase boundaries. Detecting semantic product-scope expansion in production implementation is deferred until ARIA gains an implementation-review stage.

## Artifact Persistence

`trackable` is the default artifact mode. If `.aria/` is intentionally ignored for a test, the user supplies:

```powershell
aria run --feature monitoring-dashboard-v2 --artifact-mode local
```

ARIA records this explicit exception in workflow state and tells Codex to document it in the Project Context and Review artifacts. An ignored `.aria/` folder without `artifact-mode local` fails the persistence check.

## Failure Handling

- Missing `codex`: report the availability error; state may already have been initialized but does not advance.
- Invalid feature slug: reject values that would escape `.aria/` or create ambiguous paths.
- Missing prerequisite artifact: stop with an actionable status result.
- Codex nonzero exit: preserve its output, mark the phase failed, and do not advance.
- Scope-integrity violation: mark the feature blocked and list unexpected paths.
- Invalid review gate: do not allow approval or UISpec compilation.
- Interrupted process: persist the last completed phase; a later `aria run` resumes from that state.

## Testing Strategy

The CLI uses Node's built-in test runner and temporary Git repositories.

Tests cover:

- Current-directory and `--target` repository resolution.
- Feature slug validation and `.aria/<feature>/` path resolution.
- State initialization, persistence, and resume behavior.
- Phase prerequisite and approval-gate enforcement.
- Interactive question selection and proposal rerun scheduling.
- Codex adapter argument construction using a fake executable.
- Scope-integrity acceptance for allowed artifacts and rejection for out-of-scope changes.
- Local-versus-trackable artifact persistence behavior.
- CLI help and exit-code behavior.

## Explicit Non-Goals

- OpenCode, Claude Code, or plugin support.
- Automatic production-code implementation.
- A web dashboard or GUI.
- Schema validators beyond the phase checks needed by v0.
- General workflow-engine features.
- Automatic bypass of human approval.
