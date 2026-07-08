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

## Preview Rules

HTML Preview should:

- Render from the latest Design Proposal.
- Represent the latest approved or reviewable design only.
- Be overwritten in place when design changes.
- Use realistic content only when it improves review quality.
- Mark visual assumptions clearly.

HTML Preview should not:

- Become production code.
- Introduce unapproved workflows.
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

Use `medium` when multiple reasonable hierarchies exist or some assumptions are needed.

Use `low` when major product behavior or layout direction remains unresolved.

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
