# ARIA

**AI Requirements & Interface Architect**

ARIA is an AI design partner that turns business requirements into implementation-ready design decisions.

ARIA is not a code generator. It helps teams decide what should be built before Codex decides how to build it.

Start with [manifest.md](manifest.md). It is the conceptual source for ARIA v0.1.

## v0.1 Focus

v0.1 establishes a docs-first methodology before automation.

Included:

- Project manifest and responsibility boundaries.
- Requirement-to-Design-Proposal workflow.
- Existing-page refactor workflow.
- Optional Visual Review workflow with HTML Preview as the default renderer.
- Human-facing Design Proposal contract.
- UISpec v1 implementation contract.
- Role prompts for analysis, design, and review.
- Design principles and component guidance.

Not included yet:

- Production frontend code.
- CLI tools or schema validators.
- Visual validation automation.
- Official examples.

## Core Workflow

```text
Business Requirement
  -> Discovery
  -> Design Proposal
  -> Visual Review (optional)
  -> Human Approval
  -> UISpec
  -> Codex Implementation
  -> ARIA Review
```

## Responsibility Split

ARIA:

- Owns product and UX decisions.
- Produces Design Proposals and UISpecs.
- Reviews implemented UI for design consistency.
- Does not generate production frontend code.

Codex:

- Renders ARIA's optional HTML Preview artifact.
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
  prompts/
    analyst.md
    designer.md
    reviewer.md
  schemas/
    design-proposal-v1.md
    uispec-v1.md
  design-system/
    principles.md
    components.md
```

## Document Map

- `manifest.md` defines what ARIA is and where responsibility boundaries sit.
- `workflow.md` defines the operational lifecycle.
- `visual-review-workflow.md` defines the optional visual review layer.
- `schemas/design-proposal-v1.md` defines the human-facing design artifact.
- `schemas/uispec-v1.md` defines the Codex implementation contract.
- `prompts/analyst.md` guides requirement discovery and clarification.
- `prompts/designer.md` guides UX design and UISpec compilation.
- `prompts/reviewer.md` guides implementation review against an approved UISpec.
- `design-system/principles.md` defines ARIA's design principles.
- `design-system/components.md` defines framework-agnostic component guidance.
