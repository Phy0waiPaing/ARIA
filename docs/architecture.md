# ARIA Architecture

This document describes ARIA's conceptual architecture and its deliberately small v0 runtime.

## Layers

ARIA is organized into six conceptual layers:

```text
Methodology
  -> Schemas
  -> Prompts
  -> Policies
  -> Runtime
  -> Target Project Artifacts
```

## Methodology Layer

The methodology layer defines the lifecycle and responsibility boundaries.

Files:

- `manifest.md`
- `workflow.md`
- `visual-review-workflow.md`
- `docs/ROADMAP.md`
- `docs/project-structure.md`

Responsibilities:

- Define what ARIA owns.
- Define what Codex or another coding agent owns.
- Define when humans approve design.
- Define when UISpec compilation is allowed.
- Define how future handoff and governance should fit.

## Schema Layer

The schema layer defines artifact contracts.

Files:

- `schemas/design-proposal-v1.md`
- `schemas/uispec-v1.md`
- `schemas/work-contract-v1.md`
- `schemas/design-package-v1.md`

Responsibilities:

- Keep Design Proposal human-facing.
- Keep UISpec implementation-facing.
- Keep Work Contract as governance around artifacts.
- Keep Design Package as a bundle of approved references.

## Prompt Layer

The prompt layer defines ARIA roles.

Files:

- `prompts/analyst.md`
- `prompts/designer.md`
- `prompts/reviewer.md`
- `prompts/exporter.md`

Responsibilities:

- Analyst discovers intent.
- Designer produces Design Proposals and compiles UISpecs after approval.
- Reviewer evaluates Design Proposals and HTML Previews together before human approval.
- Exporter prepares handoff bundles without changing design intent.

## Policy Layer

The policy layer defines reusable review standards.

Files:

- `design-system/principles.md`
- `design-system/components.md`
- `design-system/patterns.md`
- `policies/accessibility.md`
- `policies/gates.md`
- `policies/review/default.yaml`
- `policies/visual-review.md`
- `policies/artifact-governance.md`

Responsibilities:

- Define design quality expectations.
- Define reusable component and pattern guidance.
- Define accessibility expectations.
- Define phase gate checks, blocking failures, and allowed next actions.
- Define design-package review criteria, scoring, blocking issues, and gate outcomes.
- Define artifact acceptance and governance rules.

## Target Project Artifact Layer

The target project artifact layer lives outside the ARIA methodology repository.

All artifacts for one target-project feature live under `.aria/[feature-name]/`. This boundary keeps design context, preview evidence, review results, and implementation contracts together without scattering them through product documentation or source folders.

Target project artifacts include:

- Workflow State metadata.
- Project Context Captures.
- Design Proposals.
- Current-State UISpecs.
- Target UISpecs.
- HTML Previews.
- Design Review artifacts.
- Work Contracts.
- Design Packages.

Responsibilities:

- Capture real project decisions.
- Provide implementation contracts to coding agents.
- Preserve visual review outputs.
- Track handoff evidence.

## Runtime Layer

The v0 runtime is a local Node CLI. It orchestrates the existing workflow without replacing it.

Files:

- `src/core/phases.ts`
- `src/core/runner.ts`
- `src/core/scope-integrity.ts`
- `src/runtime/codex.ts`
- `src/bin.ts`

Responsibilities:

- Resolve a Git target repository and feature-scoped `.aria/[feature]/` paths.
- Persist only restart-critical workflow state in `workflow-state.json`.
- Invoke Codex for one bounded phase at a time.
- Present material-question choices and human approval in the terminal.
- Compare before/after snapshots to reject phase-time edits outside allowed outputs.

The runtime does not become a source of design intent. The Design Proposal, Review, and UISpec retain that role.

## Data Flow

```text
Requirement, Existing Project, or Existing Page
  -> Analyst Prompt
  -> Optional Project Context or Current-State Capture
  -> Design Proposal Schema
  -> HTML Preview, when visual review is required
  -> Review Policy
  -> Reviewer Prompt
  -> Design Review Artifact
  -> Human Approval
  -> UISpec Schema
  -> Optional Work Contract
  -> Optional Design Package
  -> Coding Agent
```

## Source-Of-Truth Rules

- Requirement is the source of business intent.
- Project Context Capture is the source of existing app conventions for new pages.
- Design Proposal is the source of human-approved design intent.
- HTML Preview is a rendered visual review artifact.
- UISpec is the source of implementation intent.
- Review Policy defines the pre-approval design gate.
- Design Review records proposal-plus-preview findings, verification evidence, score, and gate result.
- Workflow State stores only phase mechanics, selected answers, approval time, and artifact mode.
- Work Contract governs artifact validity.
- Design Package bundles references for handoff.
- Production code is owned by the target project and coding agent.

## Automation Boundary

The current v0 runtime intentionally supports only Codex. Future automation may add further runtimes, exporters, or validators after real use proves the need.

Those tools must preserve the current artifact boundaries. Automation may create or validate artifacts, but it must not turn rendered output or package notes into a new source of truth.
