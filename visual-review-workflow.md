# ARIA Visual Review Workflow

This document defines ARIA's visual review layer.

The default renderer is HTML Preview. Figma remains an optional renderer for teams that require Figma-based review. Future renderers may include Penpot, AI-generated mockups, or other visual design tools.

ARIA should remain renderer-agnostic. The workflow depends on visual validation, not on a specific visual tool.

## Purpose

The Design Proposal explains the intended experience in plain language.

The Visual Review artifact helps the user inspect layout, hierarchy, spacing, density, workflow direction, and action discoverability before ARIA compiles the UISpec for Codex.

## Core Rule

Visual Review does not replace ARIA, does not replace the Design Proposal, and does not replace the UISpec.

Visual Review artifacts are disposable validation aids. They are not production code and are not the system of record.

Source of truth:

- Design Proposal: human-approved product and UX intent.
- HTML Preview: rendered visual review artifact for developer workflows.
- UISpec: implementation contract compiled from approved design intent.
- Production code: owned by Codex and the target application.
- Design Package: future bundle that may include the HTML Preview for handoff.
- Work Contract: future governance wrapper that may define acceptance rules for preview or review artifacts.

The HTML Preview is a render of the Design Proposal. It is never edited manually.

Codex may render the HTML Preview artifact for ARIA. Rendering the preview does not make Codex responsible for design decisions.

If the HTML Preview is included in a future Design Package, it remains a visual reference only. Package inclusion does not make it production code or a source of truth.

## Artifact Audiences

| Artifact | Audience | Purpose |
| --- | --- | --- |
| Requirement | Human and ARIA | Business need |
| Design Proposal | Human and ARIA | Design discussion and approval |
| HTML Preview | Human and ARIA | Default visual validation |
| Figma Draft | Human and ARIA | Optional plugin-based visual validation |
| Design Review | Human and ARIA | Policy-based UI/UX findings and gate result |
| UISpec | Codex and engineers | Implementation contract |
| Design Package | Coding agents | Future handoff bundle |
| Work Contract | ARIA and reviewers | Future artifact governance |
| Code | Runtime and users | Product behavior |

## Primary Workflow

Recommended path:

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Render HTML Preview
  -> Review
  -> Human Approval
  -> UISpec Compilation
  -> Codex
```

Simple path:

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Review
  -> Human Approval
  -> UISpec Compilation
  -> Codex
```

For existing page refactors:

```text
Existing Page
  -> Current-State Capture
  -> Refactor Design Proposal
  -> Render HTML Preview
  -> Review
  -> Human Approval
  -> Target UISpec Compilation
  -> Codex
```

For simple non-visual changes, ARIA may skip the HTML Preview and proceed directly from Design Proposal to UISpec after approval.

For required-preview work, ARIA must not request final design approval until the HTML Preview has been rendered, the Review phase has produced `PASS` or `PASS_WITH_NOTES`, or the user explicitly accepts a recorded preview skip.

A Design Proposal must remain `status: draft` while required visual review is pending. `status: approved` is valid only after the user reviews the required preview or explicitly accepts a recorded skip reason.

## Renderer Policy

The Visual Review layer may support multiple renderers.

Current renderers:

- HTML Preview: default renderer.
- Figma: optional renderer.

Future renderers may include:

- Penpot.
- AI-generated mockups.
- Other visual design tools.

Renderer choice must not change the ARIA contract. The Design Proposal remains the human discussion artifact, and the UISpec remains the implementation contract.

## When To Use Visual Review

Use Visual Review when a picture would materially improve approval confidence.

Visual Review is required by default for:

- Layout-heavy pages.
- Dashboard, table, or dense operations screens.
- Navigation or information hierarchy changes.
- Existing page refactors where the user needs to compare current and proposed structure.
- New pages inside existing projects.
- Workflows where action placement or information density is the main design risk.
- Stakeholder review before implementation.

Skip Visual Review only when:

- The change is copy-only.
- The change is schema-only.
- The change has no material visual consequence.
- The user explicitly asks to skip visual review.
- The page is mostly backend behavior with little UI consequence.

If ARIA skips Visual Review, it must record the skip reason in the Design Proposal's Visual Review section.

When the user answers open design decisions, ARIA must update the Design Proposal first. For required-preview work, Codex then renders or re-renders the HTML Preview from that updated proposal before ARIA requests final approval.

## HTML Preview

HTML Preview is the default visual review renderer.

It exists to:

- Visualize the Design Proposal.
- Allow human review before UISpec compilation.
- Demonstrate layout, hierarchy, spacing, state treatment, and interaction direction.
- Help developers review design intent in Git-friendly local artifacts.

The HTML Preview is not production code. It is a rendered visual review artifact used only for design validation.

Core rules:

- The preview is rendered from the latest Design Proposal.
- If a preview already exists, overwrite it.
- Do not create versioned preview folders such as `v1`, `v2`, or `final`.
- Git provides history.
- The preview only represents the latest design.
- Never edit the preview directly.
- Any design change must be made in the Design Proposal, then Codex should re-render the preview.

Required-preview completeness:

- Show the primary screen or workflow.
- Show the main form, dialog, drawer, wizard step, or inspection surface when that interaction is central to the proposal.
- Show destructive confirmation and conflict/error treatment when the proposal includes dangerous actions.
- Show representative loading, empty, error, permission, and offline states when they materially affect the experience.
- Show protected, disabled, locked, or read-only behavior when the proposal depends on it.
- Use compact state panels for dense admin, dashboard, table, or operations screens instead of full-size duplicates for every state.

A required preview that only shows the default happy path is incomplete unless the proposal is truly simple and has no meaningful alternate states or risky interactions.

## HTML Preview Input

Required input:

```text
.aria/[feature-name]/design-proposal.md
```

Optional input:

```text
.aria/[feature-name]/current.uispec.md
screenshots or references from the existing page
design-system documentation
existing application references
```

## HTML Preview Output

Render:

```text
.aria/
  [feature-name]/
    preview/
      index.html
      styles.css
      interactions.js
```

Optional:

```text
.aria/
  [feature-name]/
    preview/
      assets/
```

The preview should demonstrate:

- Layout.
- Information hierarchy.
- Primary sections.
- Component placement.
- Important interaction states.
- Approval-relevant interaction behavior, not only static controls.

The preview should avoid:

- Backend logic.
- API calls.
- Authentication.
- Production architecture.
- Framework-specific code.

## Repository Structure

Target projects using ARIA should allow temporary visual review artifacts:

```text
repo/
  .aria/
    [feature-name]/
      design-proposal.md
      review.md
      target.uispec.md
      preview/
        index.html
        styles.css
        interactions.js
```

The `.aria/[feature-name]/preview/` folder contains rendered review artifacts. It is not the implementation source.

## Preview Rules

HTML Preview should:

- Be readable directly from local files or a simple static server.
- Keep behavior lightweight and illustrative.
- Use realistic content only when it improves review quality.
- Label assumptions that are not settled in the Design Proposal.
- Prefer clarity over polish.
- Represent the latest Design Proposal only.
- Implement central dialogs, tabs, filters, menus, refresh-pending states, destructive confirmations, and similar approval-relevant behavior with lightweight JavaScript when their behavior affects approval.
- Keep interaction code in `interactions.js` when a separate script improves reviewability.
- Support browser click and keyboard verification for every demonstrated critical interaction.

HTML Preview should not:

- Introduce new product behavior.
- Add unapproved workflows.
- Encode production data models.
- Choose frontend frameworks or component libraries.
- Become a shadow implementation.
- Be edited manually as a source document.
- Present an inert control as though its behavior was reviewed.

If a central interaction is intentionally static, label it `not demonstrated` in the preview and Design Proposal. Review must carry the same status and may not award full `state_and_interaction_coverage` or `interaction_clarity` credit.

## Visual Confidence

Every Visual Review artifact should include a confidence rating.

Format:

```text
Visual Confidence: high | medium | low

Reason:
- [reason]
```

Use `high` when:

- The proposal maps to existing product patterns.
- No new workflow behavior is being invented.
- Layout hierarchy is straightforward.
- Required states are clear.

Use `medium` when:

- Multiple reasonable layout hierarchies exist.
- Some visual assumptions are needed.
- The workflow is clear but density or grouping needs human judgment.

Use `low` when:

- Key product behavior is unclear.
- The proposal leaves major layout decisions unresolved.
- Existing patterns conflict.
- The preview should be treated as exploratory.

## Human Review

The user reviews:

- The persisted Design Review findings and gate result.
- Visual hierarchy.
- Information density.
- Workflow.
- Navigation.
- Layout.
- Discoverability of actions.

The user should not need to review the UISpec before approving the design direction.

## Revision Flow

When the user gives feedback on a Visual Review artifact, do not patch the UISpec directly.

Use this loop:

```text
Design Proposal
  -> Codex re-renders HTML Preview
  -> Review phase runs again
  -> Human reviews again
```

Rules:

- Feedback that changes UX intent must update the Design Proposal.
- Feedback that only changes visual presentation may update the Design Proposal's visual direction, then Codex re-renders the HTML Preview.
- UISpec compilation happens only after design approval.
- If feedback creates new ambiguity, ARIA asks before revising.

## Approval Rule

ARIA compiles the UISpec only after design approval.

Before asking for approval, ARIA's Review phase must evaluate the current Design Proposal and Preview against `policies/review/default.yaml`. A `FAIL` or `BLOCKED` result returns to revision rather than advancing to approval.

Design approval may come from:

- Design Proposal only, for simple non-visual work or when the user explicitly skips visual review.
- Design Proposal plus HTML Preview.
- Design Proposal plus another optional renderer output.

If HTML Preview is used, approval covers both:

- The Design Proposal's product intent.
- The HTML Preview's layout and hierarchy direction.

The UISpec remains the machine-facing contract generated from the approved design intent.

## Figma Renderer

Figma is optional. Use it only when the team needs Figma-based collaboration, stakeholder review, or downstream design tooling.

If Figma is used, organize it by repository rather than by feature.

Default rule:

```text
Figma file = repository
Figma page = feature or screen
Frames = current, proposal, review notes, approved
```

This avoids creating one Figma file per feature and keeps ARIA renderer-agnostic.

Recommended target-repo reference path:

```text
.aria/project/figma-reference.md
```

The Figma reference file should point to the repository master file and any relevant feature pages. It is a visual reference, not source of truth.

## Handoff To Codex

After approval, ARIA compiles the UISpec.

Codex should receive:

```text
.aria/[feature-name]/target.uispec.md
.aria/[feature-name]/preview/index.html, if available
.aria/[feature-name]/preview/styles.css, if available
.aria/[feature-name]/preview/interactions.js, if available
optional renderer reference, if available
```

Codex should implement the UISpec and use the HTML Preview only for visual alignment.

If the preview and UISpec disagree, the approved Design Proposal should be used to resolve intent before implementation continues.

## Prompt Pattern

Use this when asking Codex to render ARIA's HTML Preview artifact:

```text
Use the checked-out ARIA repository.

Render ARIA's HTML Preview from:
.aria/[feature-name]/design-proposal.md

Follow the Visual Review workflow in:
visual-review-workflow.md

Render or overwrite:
.aria/[feature-name]/preview/index.html
.aria/[feature-name]/preview/styles.css
.aria/[feature-name]/preview/interactions.js, when critical interactions must be demonstrated

Do not change product behavior.
Do not compile or modify the UISpec.
Do not implement production code.
Do not make new UX decisions.
Do not add backend logic, API calls, authentication, production architecture, or framework-specific code.
Do not create versioned preview folders.
Do not edit the preview as source; render it from the latest Design Proposal.
Mark any visual assumptions clearly.
Include a visual confidence rating and reason.
Demonstrate central interactions with lightweight behavior, or label them `not demonstrated`.
Use browser click and keyboard checks for every demonstrated critical interaction.
```

Use this when asking Codex to implement after approval:

```text
Read .aria/[feature-name]/target.uispec.md.
Use .aria/[feature-name]/preview/ as the visual reference if it exists.
Implement the UI from the approved UISpec.
Do not change UX decisions unless asked.
If the preview and UISpec disagree, pause and resolve intent from the approved Design Proposal.
```
