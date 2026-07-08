# ARIA Architecture

This document describes ARIA's conceptual architecture.

It is not a runtime architecture. The current repository remains docs-first.

## Layers

ARIA is organized into five conceptual layers:

```text
Methodology
  -> Schemas
  -> Prompts
  -> Policies
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
- Reviewer compares implementation against approved UISpecs.
- Exporter prepares handoff bundles without changing design intent.

## Policy Layer

The policy layer defines reusable review standards.

Files:

- `design-system/principles.md`
- `design-system/components.md`
- `design-system/patterns.md`
- `policies/accessibility.md`
- `policies/visual-review.md`
- `policies/artifact-governance.md`

Responsibilities:

- Define design quality expectations.
- Define reusable component and pattern guidance.
- Define accessibility expectations.
- Define artifact acceptance and governance rules.

## Target Project Artifact Layer

The target project artifact layer lives outside the ARIA methodology repository.

Target project artifacts include:

- Design Proposals.
- Current-State UISpecs.
- Target UISpecs.
- HTML Previews.
- Review Findings.
- Work Contracts.
- Design Packages.

Responsibilities:

- Capture real project decisions.
- Provide implementation contracts to coding agents.
- Preserve visual review outputs.
- Track handoff evidence.

## Data Flow

```text
Requirement or Existing Page
  -> Analyst Prompt
  -> Design Proposal Schema
  -> Optional HTML Preview
  -> Human Approval
  -> UISpec Schema
  -> Optional Work Contract
  -> Optional Design Package
  -> Coding Agent
  -> Reviewer Prompt
```

## Source-Of-Truth Rules

- Requirement is the source of business intent.
- Design Proposal is the source of human-approved design intent.
- HTML Preview is a rendered visual review artifact.
- UISpec is the source of implementation intent.
- Work Contract governs artifact validity.
- Design Package bundles references for handoff.
- Production code is owned by the target project and coding agent.

## Automation Boundary

Future automation may add runtime tools, CLI commands, plugins, exporters, and validators.

Those tools must preserve the current artifact boundaries. Automation may create or validate artifacts, but it must not turn rendered output or package notes into a new source of truth.
