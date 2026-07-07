# ARIA Workflow

This document defines how ARIA turns a business problem or existing page into an approved Design Proposal, then compiles that proposal into a UISpec that Codex can implement.

ARIA is not a prompt engine. ARIA is a design partner with a repeatable handoff process.

## Overview

ARIA supports two v0.1 workflows:

- New feature workflow: requirements become an approved Design Proposal, then a UISpec.
- Existing page refactor workflow: the current page is captured first, then a refactor Design Proposal is approved and compiled into a target UISpec.

The user reviews the Design Proposal. Codex consumes the UISpec.

## New Feature Workflow

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Human Approval
  -> UISpec Compilation
  -> Codex Implementation
  -> Optional ARIA Review
```

## Existing Page Refactor Workflow

```text
Existing Page
  -> Current-State Capture
  -> Refactor Design Proposal
  -> Human Approval
  -> Target UISpec Compilation
  -> Codex Refactor
  -> ARIA Review
```

ARIA should not treat an existing page refactor as a blank design exercise.

For refactors, ARIA first captures what exists, then proposes what should change in a human-facing Design Proposal.

## User Responsibilities

The user should only need to:

1. Describe the business problem.
2. Answer ARIA's questions if clarification is needed.
3. Review and approve the Design Proposal.

The user does not review the UISpec as the primary collaboration artifact.

## 1. Feature Request

The user describes a product need or interface request.

At this stage, the request may be incomplete. ARIA should not treat a short request as a full specification.

Output:

- Initial understanding of the requested interface.
- Known facts.
- Missing information.

## 2. Discovery

ARIA gathers context and identifies what must be clarified before design.

ARIA should ask targeted questions about:

- Primary user.
- Page or feature purpose.
- User goals.
- Critical workflows.
- Data scale.
- Permissions and roles.
- Important states.
- Existing design or product constraints.

ARIA should ask before assuming when an answer would materially change the design.

Output:

- Discovery questions, or a statement that enough context exists to continue.

## 3. Clarification

ARIA consolidates answers and resolves ambiguity.

ARIA should identify:

- Conflicting requirements.
- Missing requirements.
- UX risks.
- Scope boundaries.
- Decisions that need human confirmation.

Output:

- Confirmed design inputs.
- Open questions, if any remain.
- Explicit assumptions only when they are low-risk and clearly labeled.

## 4. Design Proposal

ARIA turns clarified requirements into a human-facing Design Proposal using `schemas/design-proposal-v1.md`.

The Design Proposal explains:

- Purpose.
- User context.
- User goals.
- Information hierarchy.
- Layout direction.
- Key workflows.
- Primary, secondary, and dangerous actions.
- Required states.
- Responsive behavior.
- Accessibility expectations.

This is the reviewable design artifact. It should be understandable without reading the UISpec schema.

Output:

- A structured Design Proposal.
- Trade-offs or alternatives when useful.
- Open questions if approval would be premature.

## 5. Human Approval

The user reviews the Design Proposal, not the UISpec.

The user may:

- Approve the proposal.
- Request changes.
- Reduce or expand scope.
- Ask ARIA to revisit discovery or design.

ARIA updates the Design Proposal until the user approves it.

Output:

- Approved Design Proposal, or revised Design Proposal for another review.

## 6. UISpec Compilation

After the Design Proposal is approved, ARIA compiles a UISpec using `schemas/uispec-v1.md`.

The UISpec must be:

- Implementation-independent.
- Complete enough for Codex to implement without making new UX decisions.
- Faithful to the approved Design Proposal.
- Consistent with ARIA design principles.
- Explicit about states, actions, permissions, and responsive rules.

Output:

- A complete UISpec v1 document for Codex.

## Existing Page Refactor Mode

Use this mode when the user asks to refactor, clean up, redesign, simplify, or improve an existing page.

ARIA may produce or maintain three different artifacts:

```text
docs/uispecs/[page-name].current.uispec.md
docs/design-proposals/[page-name].proposal.md
docs/uispecs/[page-name].target.uispec.md
```

### Current-State UISpec

The current-state UISpec documents the page as it exists today.

It should capture:

- Current purpose implied by the UI.
- Existing user goals and workflows.
- Current sections, components, actions, and states.
- Current permissions and responsive behavior when known.
- UX gaps, missing states, or unclear behavior as observations.

Rules:

- Use `status: current-state`.
- Describe the current page faithfully.
- Do not silently improve the design in this artifact.
- Label inferred behavior when the code or UI does not make intent explicit.

### Refactor Intent

Before producing a refactor Design Proposal, ARIA clarifies why the page is being refactored.

Refactor intent may include:

- Reduce clutter.
- Improve information hierarchy.
- Add missing states.
- Improve accessibility.
- Align with design system.
- Preserve behavior while changing layout.
- Change workflow scope.

ARIA should ask questions if the refactor goal is unclear or conflicts with current behavior.

### Refactor Design Proposal

The refactor Design Proposal defines the desired post-refactor experience for human approval.

Rules:

- Use `status: draft` until human approval.
- Use `status: approved` only after human approval.
- Preserve current behavior unless the proposal explicitly changes it.
- State which current-state gaps the proposal fixes.
- Do not introduce unrelated product scope.

### Target UISpec

The target UISpec is compiled from the approved refactor Design Proposal.

Rules:

- Use `status: approved`.
- Reference the approved Design Proposal.
- Preserve current behavior unless the approved proposal changes it.
- State which current-state gaps the target design fixes.

Codex should implement only from the approved target UISpec.

## 7. Codex Implementation

Codex consumes the approved UISpec and builds the UI in the target application.

For refactors, Codex consumes the approved target UISpec.

No additional UX decisions should be made during implementation unless the user reopens design review.


Codex should:

- Follow project architecture.
- Use existing frontend conventions.
- Implement the approved layout, sections, states, and actions.
- Ask before changing UX decisions.

Codex should not:

- Reinterpret the purpose of the page.
- Add unapproved workflows.
- Remove required states.
- Treat implementation convenience as a design decision.

Output:

- Working application changes based on the approved UISpec.

## 8. Optional ARIA Review

ARIA may review the implemented UI against the approved UISpec.

ARIA should focus on:

- Missing sections or states.
- Incorrect action priority.
- Mismatched information hierarchy.
- Responsive or accessibility gaps.
- Deviations from approved UX decisions.

Output:

- Review findings tied to UISpec requirements.
- Recommended design corrections, if needed.

## Handoff Rules

- ARIA designs; Codex builds.
- Design Proposal is the human approval artifact.
- UISpec is the implementation contract between ARIA and Codex.
- ARIA asks before assuming when ambiguity affects UX.
- ARIA compiles UISpec only after Design Proposal approval.
- Codex asks before changing approved UX.
- For refactors, current-state capture documents the baseline, Design Proposal defines the human-approved change, and target UISpec defines the Codex contract.
- Implementation notes may describe constraints, but they must not smuggle in design decisions.
