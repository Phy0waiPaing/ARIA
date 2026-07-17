# ARIA Design Workflow v1

This document defines the manual phase-gated workflow for proving ARIA without relying on hidden chat context.

It is the source workflow for ARIA Spike v0. A fresh runtime should be able to follow this file, read the referenced ARIA docs, and produce the same artifact sequence.

This is not a CLI implementation, validator architecture, or plugin system. Those may come later only after this manual workflow proves useful on real target projects.

## Core Rule

ARIA owns phase gates and artifacts.

Runtimes such as Codex execute one phase at a time.

Do not skip ahead. Do not create artifacts from a later phase early. Do not use conversation memory as a substitute for written artifacts.

Use `policies/gates.md` as the shared gate policy. Each phase gate asks whether the current artifact is strong enough for its next consumer.

## Manual Test Target

Use one real feature for the first spike.

Recommended target:

```text
Role CRUD in a target project repository
```

Success means the workflow can move from project context to an implementation-ready UISpec using only:

- This workflow document.
- The reusable ARIA methodology docs.
- Target-project source files.
- Persisted target-project artifacts.
- Explicit user approval at the approval gate.

Validated result:

```text
The standalone Role CRUD spike reached PASS_WITH_NOTES.
```

That run proved the full manual spike, including downstream implementation. The ARIA v1 design loop is:

```text
Project Context
  -> Design Proposal
  -> HTML Preview
  -> Review Policy
  -> Design Review Artifact
  -> Human Approval
  -> UISpec
  -> Codex
```

The Role CRUD spike continued through implementation review and reached `PASS_WITH_NOTES`. That downstream result remains useful evidence, but implementation review is not a second ARIA v1 design-review phase.

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
  - User request, including the initial requirement brief when provided.
  - Target project repository.
  - Existing routes, navigation, layout shell, nearby pages, components, API clients, roles, and state patterns.
outputs:
  - .aria/[feature-name]/project-context.md
done_when:
  - The context file records the relevant project facts.
  - For existing-project UI work, the context records concrete visual conventions, tokens, component signatures, and nearby-page examples that constrain the preview.
  - For existing-project UI work, the context includes a source-backed `## Visual Contract` section.
  - Inferred behavior is labeled as inferred.
  - Missing product intent is represented as targeted questions, not broad homework for the user.
gate:
  - Apply the Discovery Gate from `policies/gates.md`.
  - Continue to Design Proposal when ARIA has enough context to propose a design.
```

Rules:

- Required for new pages inside existing projects.
- Required for existing page refactors unless a current-state capture already exists.
- Do not write production code.
- Do not write a target UISpec.
- Do not use project context as a replacement for the Design Proposal.
- For UI work inside an existing app, capture visual evidence with enough specificity that another runtime can render a preview that fits the app. Record shell structure, page padding, typography scale, color tokens, borders, radius, shadows, density, icon usage, table/form/dialog patterns, state patterns, and source-file references.
- The Visual Contract must define shell/navigation, page container/spacing, typography, colors/tokens, reusable components, state treatments, and do-not-invent rules. If a convention is unknown, mark it unknown instead of guessing.

## Phase 2: Design Proposal

```yaml
phase: Design Proposal
question: What should be built and why?
purpose: Produce the human-facing design intent artifact.
inputs:
  - User request, including the initial requirement brief when provided.
  - Human revision requests from prior proposal, preview, or review feedback.
  - Project context, when available.
  - Current-state capture, for refactors.
  - ARIA design principles and policies.
outputs:
  - .aria/[feature-name]/design-proposal.md
done_when:
  - The proposal is understandable without reading UISpec schemas.
  - The proposal states purpose, users, hierarchy, workflows, actions, states, constraints, and assumptions.
  - Material open questions are selectable and easy to answer.
  - Status is draft until approval.
gate:
  - Apply the Proposal Gate from `policies/gates.md`.
  - Continue to HTML Preview when the draft proposal exists and required visual review has not been skipped.
  - Ask the user for answers if material design questions remain.
```

Rules:

- Write the proposal file before asking for approval.
- A chat summary may point to the proposal, but it does not replace the proposal file.
- Treat the feature slug as an artifact identifier, not as the full requirement.
- Treat human revision requests as source input for the next proposal revision.
- Do not compile a UISpec.
- Do not write production code.

## Phase 3: HTML Preview

```yaml
phase: HTML Preview
question: What should the design look like?
purpose: Render a review-complete visual artifact from the Design Proposal.
inputs:
  - .aria/[feature-name]/design-proposal.md
  - .aria/[feature-name]/project-context.md, for existing-project work.
  - Current-state capture or screenshots, when useful.
  - Existing design-system and project visual conventions.
outputs:
  - .aria/[feature-name]/preview/index.html
  - .aria/[feature-name]/preview/styles.css
  - .aria/[feature-name]/preview/interactions.js, when critical interactions must be demonstrated.
  - Optional preview assets under .aria/[feature-name]/preview/assets/
done_when:
  - The preview represents the latest Design Proposal.
  - The preview visually fits the target project's existing app shell, components, density, and design tokens unless the proposal explicitly approves a visual departure.
  - The preview covers the primary screen or flow.
  - The preview shows key state and interaction surfaces needed for review.
  - Approval-relevant interactions work, or are explicitly marked `not demonstrated`.
  - Assumptions are visible in the proposal or preview.
gate:
  - Apply the Preview Gate from `policies/gates.md`.
  - Pause for human preview review after the HTML Preview is rendered.
  - Continue to Review only after the human has had a chance to inspect the preview.
```

Rules:

- Required by default for existing page refactors, new pages inside existing projects, dense admin screens, dashboards, tables, navigation changes, and material layout changes.
- The preview must be rendered from the Design Proposal.
- The runner should stop after rendering the preview so the human can inspect visual direction before ARIA Review runs.
- If the human requests changes after preview, return to Design Proposal first, then re-render the preview from the revised proposal.
- For existing-project work, the preview must also be rendered from Project Context and nearby source evidence. Re-open the referenced source files before rendering.
- Match the existing app's visual language: layout shell, navigation treatment, page container, spacing, typography, colors, borders, radius, shadows, icon treatment, controls, tables, dialogs, forms, and state styling.
- Do not invent a new sidebar, header, accent color, decorative state section, card treatment, or component primitive unless the Design Proposal explicitly calls for that visual change.
- If static HTML cannot use the target framework directly, translate the target project's visible tokens and component signatures into local CSS variables and plain CSS.
- Do not edit the preview as the design source.
- Overwrite the existing preview in place when design changes.
- Do not create versioned preview folders.
- Do not write backend logic, API calls, authentication, production architecture, or framework-specific production code.
- Do not compile a UISpec.
- Do not write production code.
- Keep preview behavior lightweight and isolated from production architecture.
- A central interaction such as a dialog, tab switch, filter, menu, refresh-pending state, or destructive confirmation must work when its behavior affects approval.
- Static controls must not imply behavior that the preview cannot demonstrate.
- If an interaction is intentionally not implemented, label it in the preview and Design Proposal and carry it into Review as `not demonstrated`.

For required-preview work, the preview should include:

- Primary screen or flow.
- Main form, dialog, drawer, wizard step, or inspection surface when central to the proposal.
- Dangerous confirmation and conflict/error treatment when dangerous actions exist.
- Representative loading, empty, error, permission, and offline states when they affect review confidence.
- Protected, disabled, locked, or read-only behavior when the proposal depends on it.
- Compact state panels for dense admin, dashboard, table, or operations screens when full-size duplicate screens would be too heavy.

## Phase 4: Review

```yaml
phase: Review
question: Is this design package strong enough for human approval?
purpose: Evaluate the Design Proposal and HTML Preview against explicit UI and UX criteria before asking the user for final design approval.
inputs:
  - .aria/[feature-name]/design-proposal.md
  - .aria/[feature-name]/preview/index.html, when required or used.
  - .aria/[feature-name]/preview/styles.css, when required or used.
  - .aria/[feature-name]/preview/interactions.js, when present.
  - .aria/[feature-name]/project-context.md, when available.
  - Current-state capture or screenshots, for refactors.
  - ARIA's `policies/review/default.yaml`, unless a project-specific policy is provided.
outputs:
  - .aria/[feature-name]/review.md
done_when:
  - The proposal and preview are evaluated as one design package.
  - The review records interface type, policy criteria, weighted score, blocking issues, acceptable design choices, unresolved decisions, and gate result.
  - Browser or rendering evidence is recorded when the preview is required.
  - For existing-project UI work, Visual Contract alignment is checked row by row.
  - Preview validation evidence records desktop and mobile rendering, tablet when required, console status, overflow status, typography readability, and interaction evidence.
  - Artifact persistence and ignore status are recorded.
  - Each critical interaction is recorded as demonstrated, not demonstrated, not applicable, or blocked.
  - Findings are actionable and point back to the proposal or preview surface that must change.
gate:
  - Apply the Review Gate from `policies/gates.md`.
  - Continue to Human Approval for PASS or PASS_WITH_NOTES.
  - Return to Design Proposal and HTML Preview for FAIL.
  - Gather missing evidence before continuing for BLOCKED.
```

Rules:

- ARIA v1 has one Review phase with multiple checks, not separate AI reviews for proposal, preview, UISpec, and implementation.
- Review the proposal and preview together so written intent and rendered design cannot pass independently while contradicting each other.
- Classify the interface as `app_ui`, `marketing`, or `hybrid` before applying interface-specific checks.
- Use deterministic checks for artifact existence, preview rendering, overflow, and other objective failures where possible.
- Use deterministic checks for proposal structure, console errors, typography floors, viewport coverage, Visual Contract presence/alignment, critical interaction behavior, and whether `.aria/` artifacts are Git-trackable.
- Use design judgment for information architecture, visual hierarchy, interaction clarity, design-system fit, and AI-slop risk.
- Do not award `pass` for interaction coverage when a required interaction is static or unverified.
- Do not rely on the generator's confidence statement as review evidence.
- Do not repair a failed preview silently inside Review. Record `FAIL`, return to Proposal or Preview, then rerun Review and retain a resolved-findings note.
- Do not redesign the interface during review. Record findings and send failed work back to the proposal and preview phases.
- Do not compile a UISpec or write production code during Review.
- Chat may summarize the result, but it does not replace the persisted review artifact.

## Phase 5: Human Approval

```yaml
phase: Human Approval
question: Has the user approved the design intent?
purpose: Confirm the Design Proposal and visual direction before UISpec compilation.
inputs:
  - .aria/[feature-name]/design-proposal.md
  - .aria/[feature-name]/preview/index.html, when required or used.
  - .aria/[feature-name]/preview/styles.css, when required or used.
  - .aria/[feature-name]/review.md
outputs:
  - Approved or revised Design Proposal.
done_when:
  - The user explicitly approves the proposal, or sends changes.
  - The review gate is PASS or PASS_WITH_NOTES.
  - Required preview has been reviewed or explicitly skipped.
  - Material open questions are resolved.
gate:
  - Apply the Approval Gate from `policies/gates.md`.
  - Stop if changes are requested; update the proposal and re-render preview.
  - Return to Review after any material proposal or preview revision.
  - Continue to UISpec only after explicit approval.
```

Rules:

- Proposal approval permits UISpec compilation only.
- Proposal approval does not authorize production implementation.
- A FAIL or BLOCKED review cannot advance to approval.
- Do not compile a UISpec if required preview is pending.
- Do not mark the proposal `approved` while required visual review is pending.
- Do not ask for one approval that covers both UISpec compilation and implementation.

Recommended approval prompt:

```text
Review gate: `PASS_WITH_NOTES`. Reply `approve proposal` to compile the target UISpec next, or send changes. I will stop before production code until you ask for implementation from the approved UISpec.
```

## Phase 6: UISpec

```yaml
phase: UISpec
question: How should a coding agent build this interface?
purpose: Compile the approved design intent into an implementation-independent contract.
inputs:
  - Approved .aria/[feature-name]/design-proposal.md
  - .aria/[feature-name]/project-context.md, when available.
  - .aria/[feature-name]/current.uispec.md, for refactors.
  - .aria/[feature-name]/preview/index.html, when required or used.
  - .aria/[feature-name]/preview/styles.css, when required or used.
outputs:
  - .aria/[feature-name]/target.uispec.md
done_when:
  - The UISpec faithfully preserves the approved proposal.
  - The UISpec is complete enough for implementation without new UX decisions.
  - `visualReference` points to preview files when preview exists, was required, or was used.
  - No implementation note changes UX intent.
  - Required fields and references pass structural validation.
gate:
  - Apply the UISpec Gate from `policies/gates.md`.
  - Report the UISpec path and stop.
```

Rules:

- Do not compile before approval.
- Do not introduce new UX decisions.
- Do not write production code.
- UISpec schema and completeness checks are compilation validation, not a second AI design-review phase.
- If the UISpec and preview disagree, resolve intent from the approved Design Proposal before implementation.

## Downstream: Codex Implementation

Codex implementation is intentionally outside ARIA v1's pre-development scope. The manual spike may continue here to test whether the design package is useful, but this phase requires a separate user instruction.

```yaml
phase: Implementation
question: Can Codex build the approved interface from the UISpec?
purpose: Let the coding runtime implement the approved target UISpec in the target project.
inputs:
  - .aria/[feature-name]/target.uispec.md
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
  - Report implementation and verification results.
```

Rules:

- Implementation requires a separate user instruction after UISpec compilation.
- Codex may use the preview for visual alignment only.
- Codex must not redesign UX without reopening design review.
- Implementation convenience must not change approved design intent.

## Future: Implementation Conformance Review

Implementation conformance review is downstream evidence for improving ARIA. It is not the Review phase defined above and is not required to complete the ARIA v1 design package.

```yaml
phase: Implementation Conformance Review
question: Did implementation follow the UISpec?
purpose: Review the implemented UI against the approved contract.
inputs:
  - .aria/[feature-name]/target.uispec.md
  - Approved Design Proposal, for clarifying intent.
  - HTML Preview, for visual reference only.
  - A future implementation-conformance policy.
  - Running app, screenshots, code context, or verification output.
outputs:
  - A future implementation-conformance artifact path.
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
- Do not reuse the ARIA v1 design-review policy as if it were an implementation-conformance policy.
- `FAIL` means changes are requested before design-fidelity acceptance.
- `BLOCKED` means ARIA could not review enough evidence to decide.

The exact implementation-conformance policy and artifact structure should be defined only after more downstream spikes demonstrate what evidence is useful. The previous Role CRUD spike artifact remains historical evidence rather than the v1 template.

Historical spike artifact structure:

```markdown
# [Feature Name] ARIA Review

Feature:
Workflow phase: Implementation Conformance Review
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
