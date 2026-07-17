# ARIA Gate Policy

This policy defines when ARIA may move from one artifact audience to the next.

Core rule:

```text
ARIA may advance only when the current artifact is strong enough for its next consumer.
```

Gates are not ceremony. They protect the handoff:

- Humans need a clear proposal and visual direction.
- ARIA needs enough evidence to review design quality.
- Codex needs a UISpec that does not require new UX decisions.

## Gate Outcomes

Use these outcomes consistently:

| Outcome | Meaning |
| --- | --- |
| `PASS` | The artifact satisfies the gate with no blocking issues. |
| `PASS_WITH_NOTES` | The artifact may advance; non-blocking notes remain. |
| `FAIL` | Blocking issues must be fixed before advancing. |
| `BLOCKED` | ARIA lacks evidence or input needed to decide. |
| `WAITING_FOR_HUMAN` | Human input, preview review, or approval is required. |

`FAIL` and `BLOCKED` never advance automatically.

`WAITING_FOR_HUMAN` is non-terminal. The workflow must persist state and resume after the user responds.

## Discovery Gate

Question:

```text
Can ARIA design safely from the available context?
```

Inputs:

- User request.
- Target repository context when applicable.
- Existing page or nearby-page evidence when applicable.
- Relevant product/API/domain facts.

Required checks:

- Primary user and purpose are known or safely inferred.
- Material product questions are answered, or recorded as selectable questions.
- Existing-project UI work has a source-backed Project Context.
- Existing-project UI work has a `## Visual Contract`.
- Inferences are labeled.
- No major business rule is guessed.

Blocking failures:

- Missing primary workflow.
- Missing permission or destructive-action behavior that changes UX.
- Missing Visual Contract for existing-project UI work.
- Broad open-ended questions used where known choices exist.
- Hidden assumptions that would materially change design.

Allowed next action:

- Continue to Design Proposal.
- Or pause with `WAITING_FOR_HUMAN`.

## Proposal Gate

Question:

```text
Can a human understand and discuss the intended design?
```

Inputs:

- Draft Design Proposal.
- Project Context or current-state capture when applicable.
- Selected question answers.

Required checks:

- Purpose, user goals, information hierarchy, actions, workflows, states, permissions, responsive direction, and accessibility intent are present.
- Existing-project constraints and Visual Contract implications are carried into the proposal.
- Open product decisions are explicit and selectable.
- Proposal status remains `draft` until approval.
- No UISpec or production implementation is generated.

Blocking failures:

- Proposal reads like a schema instead of human design intent.
- Missing primary action or dangerous-action consequence.
- Missing required state coverage.
- Existing-project conventions are ignored without an approved reason.
- Required visual review is skipped without a recorded reason.

Allowed next action:

- Continue to HTML Preview.
- Or pause with `WAITING_FOR_HUMAN`.

## Preview Gate

Question:

```text
Can a human visually review the design direction?
```

Inputs:

- Latest Design Proposal.
- Project Context and Visual Contract when applicable.
- Current-state capture or screenshots when applicable.

Required checks:

- HTML Preview exists at `.aria/[feature-name]/preview/index.html`.
- Preview represents the latest Design Proposal.
- Existing-project preview follows the Visual Contract.
- Primary screen or flow is visible.
- Approval-relevant interactions work, or are explicitly marked `not demonstrated`.
- Loading, empty, error, permission, conflict, destructive, and read-only states are represented when they affect review confidence.
- Review-only state samples are compact and subordinate.

Blocking failures:

- Missing required preview.
- Preview contradicts the Design Proposal.
- Preview contradicts the Visual Contract.
- Preview invents a new shell, palette, density, component primitive, or decorative structure without approval.
- Required interaction is inert while presented as reviewed.
- Preview cannot render.

Allowed next action:

- Pause with `WAITING_FOR_HUMAN` for preview inspection.
- Continue to Review only after the human has had the chance to inspect the preview.

## Review Gate

Question:

```text
Is the design package strong enough to ask for approval?
```

Inputs:

- Design Proposal.
- HTML Preview when required or used.
- Project Context and Visual Contract when applicable.
- Review policy.

Required checks:

- Artifact structure and persistence are valid.
- Preview render, console, overflow, typography, viewport, interaction, and Visual Contract checks are recorded.
- Criteria are scored using the review policy.
- Blocking issues are named.
- Findings are actionable.
- Gate result is persisted in `.aria/[feature-name]/review.md`.

Blocking failures:

- Any required deterministic check fails.
- Required evidence is missing.
- Review score is below the configured threshold.
- Policy blocking issue is present.
- Review relies on generator confidence instead of evidence.

Allowed next action:

- Continue to Human Approval for `PASS` or `PASS_WITH_NOTES`.
- Return to Proposal or Preview for `FAIL`.
- Gather missing evidence for `BLOCKED`.

## Approval Gate

Question:

```text
Has the human approved design intent?
```

Inputs:

- Design Proposal.
- Preview when required or used.
- Review artifact.

Required checks:

- Review gate is `PASS` or `PASS_WITH_NOTES`.
- Material questions are resolved.
- Required preview has been reviewed or explicitly skipped.
- User explicitly approves proposal intent.

Blocking failures:

- Approval requested from a chat-only proposal.
- Approval requested while Review is `FAIL` or `BLOCKED`.
- Approval requested before required preview inspection.
- Approval bundled with production implementation.

Allowed next action:

- Continue to UISpec compilation.
- Or pause with `WAITING_FOR_HUMAN`.

## UISpec Gate

Question:

```text
Can Codex implement without redesigning?
```

Inputs:

- Approved Design Proposal.
- Review artifact.
- Project Context and Visual Contract when applicable.
- Preview when required or used.

Required checks:

- UISpec references the approved proposal and preview when available.
- Sections, data rules, visibility rules, states, actions, permissions, responsive behavior, accessibility, and acceptance criteria are explicit.
- Existing-project Visual Contract requirements and approved deviations are preserved.
- Preview alignment requirements are named.
- Do-not-do rules prevent common implementation drift.
- No new UX decision is introduced during UISpec compilation.

Blocking failures:

- UISpec leaves multiple materially different UI interpretations open.
- Missing required states or action behavior.
- Missing conditional rendering rules.
- Missing acceptance criteria.
- Vague phrases such as `as needed`, `appropriate`, or `relevant` stand in for design decisions.
- UISpec contradicts the approved proposal.

Allowed next action:

- Report the UISpec path and stop.
- Production implementation requires a separate user instruction.
