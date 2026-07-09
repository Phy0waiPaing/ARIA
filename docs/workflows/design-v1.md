# ARIA Design Workflow v1

This document defines the manual phase-gated workflow for proving ARIA without relying on hidden chat context.

It is the source workflow for ARIA Spike v0. A fresh runtime should be able to follow this file, read the referenced ARIA docs, and produce the same artifact sequence.

This is not a CLI implementation, validator architecture, or plugin system. Those may come later only after this manual workflow proves useful on real target projects.

## Core Rule

ARIA owns phase gates and artifacts.

Runtimes such as Codex execute one phase at a time.

Do not skip ahead. Do not create artifacts from a later phase early. Do not use conversation memory as a substitute for written artifacts.

## Manual Test Target

Use one real feature for the first spike.

Recommended target:

```text
Role CRUD in D:\GW\svmp
```

Success means the workflow can move from project context to implementation review using only:

- This workflow document.
- The reusable ARIA methodology docs.
- Target-project source files.
- Persisted target-project artifacts.
- Explicit user approval at the approval gate.

## Phase Format

Each phase uses:

```yaml
phase:
question:
purpose:
inputs:
outputs:
done_when:
gate:
```

`done_when` defines the practical acceptance check for the phase. It is not a separate validator system.
`gate` defines what must happen before the workflow may move forward, pause, or branch.

## Phase 1: Project Context

```yaml
phase: Project Context
question: What existing project facts should shape this design?
purpose: Capture the target app context before proposing a new page or refactor.
inputs:
  - User request.
  - Target project repository.
  - Existing routes, navigation, layout shell, nearby pages, components, API clients, roles, and state patterns.
outputs:
  - docs/aria-context/[feature-name].project-context.md
done_when:
  - The context file records the relevant project facts.
  - Inferred behavior is labeled as inferred.
  - Missing product intent is represented as targeted questions, not broad homework for the user.
gate:
  - Continue to Design Proposal when ARIA has enough context to propose a design.
```

Rules:

- Required for new pages inside existing projects.
- Required for existing page refactors unless a current-state capture already exists.
- Do not write production code.
- Do not write a target UISpec.
- Do not use project context as a replacement for the Design Proposal.

## Phase 2: Design Proposal

```yaml
phase: Design Proposal
question: What should be built and why?
purpose: Produce the human-facing design intent artifact.
inputs:
  - User request.
  - Project context, when available.
  - Current-state capture, for refactors.
  - ARIA design principles and policies.
outputs:
  - docs/design-proposals/[feature-name].proposal.md
done_when:
  - The proposal is understandable without reading UISpec schemas.
  - The proposal states purpose, users, hierarchy, workflows, actions, states, constraints, and assumptions.
  - Material open questions are selectable and easy to answer.
  - Status is draft until approval.
gate:
  - Continue to HTML Preview when the draft proposal exists and required visual review has not been skipped.
  - Ask the user for answers if material design questions remain.
```

Rules:

- Write the proposal file before asking for approval.
- A chat summary may point to the proposal, but it does not replace the proposal file.
- Do not compile a UISpec.
- Do not write production code.

## Phase 3: HTML Preview

```yaml
phase: HTML Preview
question: What should the design look like?
purpose: Render a review-complete visual artifact from the Design Proposal.
inputs:
  - docs/design-proposals/[feature-name].proposal.md
  - Current-state capture or screenshots, when useful.
  - Existing design-system and project visual conventions.
outputs:
  - preview/[feature-name]/index.html
  - preview/[feature-name]/styles.css
  - Optional preview assets under preview/[feature-name]/assets/
done_when:
  - The preview represents the latest Design Proposal.
  - The preview covers the primary screen or flow.
  - The preview shows key state and interaction surfaces needed for review.
  - Assumptions are visible in the proposal or preview.
gate:
  - Ask the user to review the Design Proposal plus HTML Preview.
```

Rules:

- Required by default for existing page refactors, new pages inside existing projects, dense admin screens, dashboards, tables, navigation changes, and material layout changes.
- The preview must be rendered from the Design Proposal.
- Do not edit the preview as the design source.
- Overwrite the existing preview in place when design changes.
- Do not create versioned preview folders.
- Do not write backend logic, API calls, authentication, production architecture, or framework-specific production code.
- Do not compile a UISpec.
- Do not write production code.

For required-preview work, the preview should include:

- Primary screen or flow.
- Main form, dialog, drawer, wizard step, or inspection surface when central to the proposal.
- Dangerous confirmation and conflict/error treatment when dangerous actions exist.
- Representative loading, empty, error, permission, and offline states when they affect review confidence.
- Protected, disabled, locked, or read-only behavior when the proposal depends on it.
- Compact state panels for dense admin, dashboard, table, or operations screens when full-size duplicate screens would be too heavy.

## Phase 4: Human Approval

```yaml
phase: Human Approval
question: Has the user approved the design intent?
purpose: Confirm the Design Proposal and visual direction before UISpec compilation.
inputs:
  - docs/design-proposals/[feature-name].proposal.md
  - preview/[feature-name]/index.html, when required or used.
  - preview/[feature-name]/styles.css, when required or used.
outputs:
  - Approved or revised Design Proposal.
done_when:
  - The user explicitly approves the proposal, or sends changes.
  - Required preview has been reviewed or explicitly skipped.
  - Material open questions are resolved.
gate:
  - Stop if changes are requested; update the proposal and re-render preview.
  - Continue to UISpec only after explicit approval.
```

Rules:

- Proposal approval permits UISpec compilation only.
- Proposal approval does not authorize production implementation.
- Do not compile a UISpec if required preview is pending.
- Do not mark the proposal `approved` while required visual review is pending.
- Do not ask for one approval that covers both UISpec compilation and implementation.

Recommended approval prompt:

```text
Reply `approve proposal` to compile the target UISpec next, or send changes. I will stop before production code until you ask for implementation from the approved UISpec.
```

## Phase 5: UISpec

```yaml
phase: UISpec
question: How should a coding agent build this interface?
purpose: Compile the approved design intent into an implementation-independent contract.
inputs:
  - Approved docs/design-proposals/[feature-name].proposal.md
  - docs/aria-context/[feature-name].project-context.md, when available.
  - docs/uispecs/[page-name].current.uispec.md, for refactors.
  - preview/[feature-name]/index.html, when required or used.
  - preview/[feature-name]/styles.css, when required or used.
outputs:
  - docs/uispecs/[feature-name].target.uispec.md
done_when:
  - The UISpec faithfully preserves the approved proposal.
  - The UISpec is complete enough for implementation without new UX decisions.
  - `visualReference` points to preview files when preview exists, was required, or was used.
  - No implementation note changes UX intent.
gate:
  - Report the UISpec path and stop.
```

Rules:

- Do not compile before approval.
- Do not introduce new UX decisions.
- Do not write production code.
- If the UISpec and preview disagree, resolve intent from the approved Design Proposal before implementation.

## Phase 6: Implementation

```yaml
phase: Implementation
question: Can Codex build the approved interface from the UISpec?
purpose: Let the coding runtime implement the approved target UISpec in the target project.
inputs:
  - docs/uispecs/[feature-name].target.uispec.md
  - Approved Design Proposal, for clarification only.
  - HTML Preview, for visual alignment only.
  - Target project source files.
outputs:
  - Production code changes in the target project.
  - Tests or verification appropriate to the target project.
done_when:
  - The implementation follows the approved UISpec.
  - Required states, actions, permissions, and responsive behavior are implemented or explicitly blocked.
  - Verification results are reported.
gate:
  - Continue to ARIA Review when implementation is complete enough to inspect.
```

Rules:

- Implementation requires a separate user instruction after UISpec compilation.
- Codex may use the preview for visual alignment only.
- Codex must not redesign UX without reopening design review.
- Implementation convenience must not change approved design intent.

## Phase 7: ARIA Review

```yaml
phase: ARIA Review
question: Did implementation follow the UISpec?
purpose: Review the implemented UI against the approved contract.
inputs:
  - docs/uispecs/[feature-name].target.uispec.md
  - Approved Design Proposal, for clarifying intent.
  - HTML Preview, for visual reference only.
  - D:\Nemo\Projects\ARIA\policies\review\default.yaml, unless a project-specific review policy is provided.
  - Running app, screenshots, code context, or verification output.
outputs:
  - docs/aria-reviews/[feature-name].review.md
done_when:
  - The review artifact is written in the target project.
  - The review artifact names the review policy used.
  - Criteria results and gate result follow the review policy.
  - Blocking issues from the review policy are checked and recorded.
  - Findings identify missing sections, states, actions, permissions, hierarchy mismatches, responsive gaps, accessibility gaps, or approved-intent deviations.
  - Acceptable implementation choices are separated from design regressions.
  - Verification performed during review is recorded, including blocked verification.
gate:
  - Report the review artifact path and stop.
```

Rules:

- Review UX fidelity, not code style.
- Do not invent requirements absent from the UISpec.
- Do not treat HTML Preview as source of truth over the approved UISpec.
- Do not redesign during review.
- Do not write production code during review unless the user explicitly asks for fixes after the review.
- Chat may summarize findings, but it does not replace the review artifact.
- Use the review policy to produce structured criteria results and a gate result.
- Do not invent new criteria names when using the default policy; record project-specific concerns as findings or notes.
- `FAIL` means changes are requested before design-fidelity acceptance.
- `BLOCKED` means ARIA could not review enough evidence to decide.

Required review artifact structure:

```markdown
# [Feature Name] ARIA Review

Feature:
Workflow phase: ARIA Review
Status: findings | accepted | blocked
Reviewed UISpec:
Review Policy:
Reviewed implementation:
Verification:

## Gate Result

Gate: PASS | PASS_WITH_NOTES | FAIL | BLOCKED

## Criteria Results

- uispec_fidelity: pass | notes | fail | not_reviewed
- design_system_compliance: pass | notes | fail | not_reviewed
- state_and_interaction_coverage: pass | notes | fail | not_reviewed
- accessibility: pass | notes | fail | not_reviewed
- responsive_behavior: pass | notes | fail | not_reviewed
- verification_evidence: pass | notes | fail | not_reviewed

## Blocking Issues

- ...

## Findings

1. ...

## Acceptable Implementation Choices

- ...

## Review Result

Changes requested before design-fidelity acceptance.
```

## Spike Log

When executing this workflow manually, record:

```markdown
## Spike Log

Target project:
Feature:
Date:

### What Worked

- ...

### What Broke

- ...

### Manual Intervention Needed

- ...

### Workflow Changes Suggested By Evidence

- ...
```

Do not add a new artifact, workflow step, or abstraction unless this log points to a real failure in the current workflow.
