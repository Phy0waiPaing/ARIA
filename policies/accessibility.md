# Accessibility Policy

This policy defines baseline accessibility expectations for ARIA artifacts.

It is framework-agnostic and should be referenced by Design Proposals, UISpecs, reviews, and future Work Contracts.

## Core Rule

Accessibility requirements must be visible before implementation.

ARIA should not leave accessibility as an implementation afterthought.

## Required Expectations

Every approved target UISpec should define:

- Keyboard navigation expectations.
- Focus order.
- Screen reader labels and landmarks.
- Contrast expectations.
- Error messaging behavior.
- State and status announcement expectations.
- Motion or animation constraints.

## Interaction Rules

Interactive elements must:

- Be keyboard reachable.
- Have visible focus states.
- Use clear labels.
- Preserve expected platform behavior.
- Avoid relying on color alone to communicate status.

## Layout Rules

Layouts must:

- Preserve primary workflows on smaller screens.
- Avoid hiding critical information without an alternate access path.
- Keep related labels, controls, and error messages near each other.
- Avoid interaction targets that are too small for touch contexts.

## State Rules

Loading, empty, error, offline, permission denied, and success states should:

- Explain what is happening.
- Preserve user orientation.
- Offer a useful recovery path when possible.
- Make status perceivable without relying on color alone.

## Review Rules

ARIA Review should flag:

- Missing keyboard paths.
- Missing focus behavior.
- Ambiguous labels.
- Color-only status.
- Missing error recovery.
- Responsive behavior that removes essential access.

Accessibility findings should be tied to the approved UISpec or to this policy.
