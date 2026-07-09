# ARIA

**AI Requirements & Interface Architect**

ARIA is an AI design partner that turns business requirements into implementation-ready design decisions.

ARIA is not a code generator. It helps teams decide what should be built before Codex decides how to build it.

Start with [manifest.md](manifest.md). It is the conceptual source for ARIA v0.1.

For the v1 direction, see [docs/ROADMAP.md](docs/ROADMAP.md). The roadmap describes ARIA's evolution toward an AI Design Orchestrator, while this repository remains docs-first.

## v0.1 Focus

v0.1 establishes a docs-first methodology before automation.

Included:

- Project manifest and responsibility boundaries.
- Requirement-to-Design-Proposal workflow.
- Existing-page refactor workflow.
- New-page-in-existing-project workflow with project context capture.
- Manual phase-gated design workflow for ARIA-alone spike testing.
- Visual Review workflow with HTML Preview as the default renderer for visual UI work.
- Human-facing Design Proposal contract.
- UISpec v1 implementation contract.
- Future Design Package schema stub.
- Future Work Contract schema stub.
- Role prompts for analysis, design, review, and export.
- Design principles, component guidance, and pattern guidance.
- Accessibility, visual review, review gate, and artifact governance policies.

Not included yet:

- Production frontend code.
- CLI tools or schema validators.
- Visual validation automation.
- Design Package automation.
- Work Contract enforcement.
- Official examples.

## Core Workflow

```text
Business Requirement
  -> Discovery
  -> Design Proposal
  -> Visual Review
  -> Human Approval
  -> UISpec
  -> Codex Implementation
  -> ARIA Review
```

## Proven Spike

The manual ARIA-alone workflow was validated against a real target-project Role CRUD page in `D:\GW\svmp`.

Result:

- ARIA produced Project Context, Design Proposal, HTML Preview, approved UISpec, and persisted ARIA Review artifacts.
- Codex implemented from the approved UISpec as a separate phase.
- ARIA Review used `policies/review/default.yaml`.
- The review artifact recorded `PASS_WITH_NOTES`, with no blocking design-fidelity issues.
- Notes were verification-scope limits, not design blockers.

## Responsibility Split

ARIA:

- Owns product and UX decisions.
- Produces Design Proposals and UISpecs.
- Reviews implemented UI for design consistency.
- Does not generate production frontend code.

Codex:

- Renders ARIA's HTML Preview artifact for visual UI work.
- Builds production frontend.
- Follows the approved UISpec.
- Does not redesign UX without explicit instruction.

## Repository Structure

```text
ARIA/
  manifest.md
  README.md
  workflow.md
  visual-review-workflow.md
  docs/
    ROADMAP.md
    architecture.md
    project-structure.md
    workflows/
      design-v1.md
  prompts/
    analyst.md
    designer.md
    reviewer.md
    exporter.md
  schemas/
    design-proposal-v1.md
    uispec-v1.md
    work-contract-v1.md
    design-package-v1.md
  design-system/
    principles.md
    components.md
    patterns.md
  policies/
    accessibility.md
    review/
      default.yaml
    visual-review.md
    artifact-governance.md
```

## Document Map

- `manifest.md` defines what ARIA is and where responsibility boundaries sit.
- `docs/ROADMAP.md` defines the v1 direction and future phases.
- `docs/architecture.md` defines ARIA's conceptual layers.
- `docs/project-structure.md` defines ARIA-owned files and target-project artifact locations.
- `docs/workflows/design-v1.md` defines the manual phase-gated workflow for proving ARIA without hidden chat context.
- `workflow.md` defines the operational lifecycle.
- `visual-review-workflow.md` defines the visual review layer.
- `schemas/design-proposal-v1.md` defines the human-facing design artifact.
- `schemas/uispec-v1.md` defines the Codex implementation contract.
- `schemas/work-contract-v1.md` defines a future artifact governance wrapper.
- `schemas/design-package-v1.md` defines a future coding-agent handoff bundle.
- `prompts/analyst.md` guides requirement discovery and clarification.
- `prompts/designer.md` guides UX design and UISpec compilation.
- `prompts/reviewer.md` guides implementation review against an approved UISpec.
- `prompts/exporter.md` guides Design Package export.
- `design-system/principles.md` defines ARIA's design principles.
- `design-system/components.md` defines framework-agnostic component guidance.
- `design-system/patterns.md` defines reusable UX pattern guidance.
- `policies/accessibility.md` defines baseline accessibility expectations.
- `policies/review/default.yaml` defines ARIA's default review criteria, blocking issues, and gate result model.
- `policies/visual-review.md` defines visual review rules.
- `policies/artifact-governance.md` defines artifact ownership, consumer, and acceptance rules.
