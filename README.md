# ARIA

**AI Requirements & Interface Architect**

ARIA is a docs-first design workflow for turning business requirements into structured UI specifications that implementation agents such as Codex can build from.

ARIA is not a coding assistant. It designs the user experience, defines the interface contract, and reviews implementation fidelity.

## v0.1 Focus

v0.1 establishes the methodology before automation.

Included:

- ARIA responsibilities and boundaries.
- A requirement-to-design-proposal workflow.
- An existing-page refactor workflow.
- A human-facing Design Proposal contract.
- A fillable UISpec v1 contract.
- Role prompts for analysis, design, and review.
- Design principles and component guidance.

Not included yet:

- Production frontend code.
- CLI tools or schema validators.
- Figma generation.
- Visual validation automation.
- Example UISpecs.

## Core Workflow

New feature:

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Human Approval
  -> UISpec
  -> Codex Implementation
  -> Optional ARIA Review
```

Existing page refactor:

```text
Existing Page
  -> Current-State Capture
  -> Refactor Design Proposal
  -> Human Approval
  -> Target UISpec
  -> Codex Refactor
  -> ARIA Review
```

## User Workflow

The user should only need to do three things:

1. Describe the business problem.
2. Answer ARIA's questions when clarification is needed.
3. Review the Design Proposal.

The user should not need to understand UISpec schemas. ARIA compiles the UISpec after the Design Proposal is approved.

## Artifact Audiences

- Design Proposal: human-facing design conversation between the user and ARIA.
- UISpec: machine-facing implementation contract between ARIA and Codex.

## Responsibilities

ARIA:

- Understands business requirements.
- Asks clarifying questions when requirements are incomplete.
- Produces human-facing Design Proposals.
- Compiles approved Design Proposals into implementation-independent UISpecs.
- Documents existing UI as current-state UISpecs before refactors.
- Reviews implemented UI against approved UISpecs.

Codex:

- Reads approved UISpecs.
- Implements the UI in the target project.
- Follows project architecture and design-system constraints.
- Avoids changing UX decisions unless asked.

## Repository Structure

```text
ARIA/
  README.md
  workflow.md
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

- `workflow.md` defines the full ARIA lifecycle.
- `schemas/design-proposal-v1.md` defines the human-facing design approval artifact.
- `schemas/uispec-v1.md` defines the handoff contract between ARIA and Codex.
- `prompts/analyst.md` guides requirement discovery and clarification.
- `prompts/designer.md` guides UX design and UISpec generation.
- `prompts/reviewer.md` guides review of implemented UI against an approved UISpec.
- `design-system/principles.md` defines ARIA's design principles.
- `design-system/components.md` defines framework-agnostic component guidance.

## Roadmap

### v0.1 - Foundation

- Define ARIA's responsibilities.
- Define the design workflow.
- Define Design Proposal v1.
- Define UISpec v1.
- Define existing-page refactor mode.
- Define role prompts.
- Define design principles and component guidance.

### v0.2 - Examples and Patterns

- Add example UISpecs.
- Add reusable page patterns.
- Refine prompts from real usage.

### v0.3 - Review and Validation

- Add implementation review workflows.
- Add UISpec-to-implementation checklists.
- Explore visual validation support.

### Later

- Explore Figma-oriented output.
- Explore schema validation.
- Explore automation around ARIA handoffs.
