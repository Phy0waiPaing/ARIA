# Visual Review Policy

This policy defines how ARIA treats visual review artifacts.

It complements `visual-review-workflow.md`.

## Core Rule

Visual Review helps humans validate design direction. It does not replace the Design Proposal or UISpec.

## Preferred Renderer

HTML Preview is the default renderer for developer workflows.

Figma and other renderers remain optional.

Renderer choice must not change source-of-truth rules:

- Design Proposal owns human-approved design intent.
- HTML Preview shows rendered visual direction.
- UISpec owns implementation intent.

## Review Gate

Visual Review is required by default for:

- Existing page refactors.
- New pages inside existing projects.
- Layout-heavy pages.
- Dense admin, dashboard, table, or operations screens.
- Navigation or information hierarchy changes.
- Workflows where action placement or information density is the main design risk.

Visual Review may be skipped only when:

- The change is copy-only.
- The change is schema-only.
- The change has no material visual consequence.
- The user explicitly asks to skip visual review.

If ARIA skips Visual Review, it must record the reason in the Design Proposal.

## Preview Rules

HTML Preview should:

- Render from the latest Design Proposal.
- Represent the latest approved or reviewable design only.
- For existing-project work, render from the Design Proposal plus Project Context and nearby app source evidence.
- Match the target app's existing shell, navigation, page container, spacing, typography, color tokens, borders, radius, shadows, icon usage, controls, tables, dialogs, forms, state styling, and density unless the proposal explicitly approves a departure.
- Be overwritten in place when design changes.
- Use realistic content only when it improves review quality.
- Mark visual assumptions clearly.
- Include the primary screen plus the key states and interaction surfaces needed to judge the proposal.
- Use compact panels for loading, empty, error, permission, conflict, protected/read-only, and destructive-confirmation states when full-size screens would be too heavy.

HTML Preview should not:

- Become production code.
- Introduce unapproved workflows.
- Invent a new visual system, shell, accent palette, component primitive, decorative state section, or density model when the target project already provides one.
- Choose frontend frameworks.
- Encode backend behavior.
- Be manually edited as the design source.

## Confidence Ratings

Visual Review artifacts should include:

```text
Visual Confidence: high | medium | low

Reason:
- [reason]
```

Use `high` when the layout follows known patterns and required states are clear.

Use `medium` when multiple reasonable hierarchies exist, some assumptions are needed, or the preview omits secondary but non-blocking states.

Use `low` when major product behavior or layout direction remains unresolved, or when a required-preview artifact shows only the happy path for a stateful workflow.

## Review Scope

Visual review may evaluate:

- Layout.
- Information hierarchy.
- Density.
- Spacing.
- Action discoverability.
- Responsive direction.
- State visibility.

Visual review should not approve:

- Production architecture.
- Backend logic.
- API behavior.
- Framework choice.
- Unapproved UX changes.
