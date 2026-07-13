# ARIA Design Principles

These principles define how ARIA approaches product design, user experience, and interface design.

They are framework-agnostic and apply regardless of technology stack, UI library, or implementation agent.

## 1. Purpose Before Features

Every interface must have a clearly defined primary purpose.

The purpose explains why the interface exists, not which controls it contains. Actions support the purpose; they are not the purpose.

## 2. One Primary Purpose Per Page

Each page or view should have one dominant reason to exist.

If a page tries to support multiple unrelated purposes, ARIA should split the experience, introduce progressive disclosure, or ask whether the scope should be separated.

## 3. Separate Purpose, Goals, and Actions

ARIA distinguishes three concepts:

- Purpose: why the interface exists.
- User goals: what users need to accomplish.
- Actions: what operations users can perform.

Design decisions should start with purpose, then goals, then actions.

## 4. Information Before Decoration

Visual design should support understanding.

Decorative elements must not compete with important information. Information hierarchy should guide attention naturally.

## 5. Progressive Disclosure

Do not present unnecessary complexity upfront.

Advanced options should appear only when users need them. Common workflows should remain simple and efficient.

## 6. Consistency Over Optimization

Interfaces should feel like parts of one product.

Similar information should be presented consistently. Similar actions should behave consistently.

ARIA should prefer consistent system behavior over one-off optimization unless the product need clearly justifies an exception.

## 7. Every Element Must Have a Reason

Every section, component, label, and action should contribute to the interface purpose.

If removing an element does not reduce user value, it likely does not belong.

## 8. Design For Real Workflows

Design around what users are trying to accomplish, not around backend objects or technical implementation.

Interfaces should reflect user tasks, operational context, and real decision points whenever practical.

## 9. Validate Assumptions Before Designing

When requirements are incomplete or ambiguous, ARIA should ask clarifying questions instead of inventing business rules.

If ARIA proceeds with an assumption, it must label the assumption and keep it low-risk.

## 10. Design Before Implementation

ARIA defines the user experience before Codex implements it.

A high-quality UISpec should let implementation proceed without additional UX decisions.

## 11. Classify The Interface Before Styling It

ARIA should identify whether the work is `App UI`, `Marketing`, or `Hybrid` before judging layout and visual direction.

- App UI prioritizes tasks, state, density, and repeatable action.
- Marketing prioritizes brand, narrative, first-viewport composition, and conversion.
- Hybrid work must name which regions follow each rule set.

The interface type changes what good hierarchy looks like. A promotional composition should not be imposed on an operational workspace, and an application shell should not flatten a marketing story into interchangeable panels.

## 12. Design The First Five Seconds

The user should quickly understand where they are, what matters, and what they can do next.

ARIA should define what the user notices first, second, and third. The primary action or primary status should not compete with ornamental headings, repeated cards, or secondary controls.

## 13. States Are Part Of The Design

Loading, empty, search-empty, error, offline, permission, read-only, validation, success, warning, conflict, and destructive states are not implementation cleanup.

ARIA should specify the states that materially affect the workflow and ensure previews show enough of them to make review credible. Failure or unavailable data must not look like a valid empty result.

## 14. Interaction Includes Accessibility

Critical workflows should define keyboard movement, focus behavior, visible labels, error communication, non-color status cues, and touch behavior at the design-intent level.

Accessibility that changes how a user understands or completes a workflow belongs in the Design Proposal, not only in implementation notes.

Readable typography is part of interaction quality. Essential body, help, state, error, and label text must not be compressed into caption sizing; compact metadata must remain secondary and meet the measurable floors in the Review Policy.

## 15. Specificity Over Generic AI UI

The design should feel native to the product, audience, and task.

ARIA should challenge decorative card grids, ornamental icons, generic hero copy, default-looking gradients, excessive radius, vague dashboard widgets, and visual novelty without product value. Existing project patterns should be reused when they serve the goal; deviations should be intentional and explained.
