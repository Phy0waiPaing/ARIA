# Design Proposal v1

Design Proposal is the human-facing artifact between ARIA and the user.

It explains the proposed user experience in plain language so the user can approve the design before ARIA compiles a UISpec for Codex.

## Core Rule

The user approves the Design Proposal, not the UISpec.

The Design Proposal should be understandable without knowing ARIA schemas, frontend architecture, or implementation details.

For target-project workflows, the Design Proposal is a persisted file artifact. A chat summary can help review, but it does not replace the proposal file.

## Required Structure

Every Design Proposal v1 document must include these sections in order.

## 1. Metadata

Purpose: identify the proposal and its review status.

Required fields:

```yaml
name:
version:
status: draft | approved | revised
created:
updated:
owner:
sourceRequest:
projectContext:
```

Rules:

- `name` should describe the interface or workflow.
- `status` must be `approved` before ARIA compiles a UISpec from it.
- `sourceRequest` should preserve the original user problem statement.
- `projectContext` should point to a project context capture artifact when the proposal is for a new page in an existing project.
- Draft proposals must be written before approval is requested.
- `status: approved` is invalid while required visual review is pending or while open product decisions materially affect the design.

## 2. Problem Understanding

Purpose: restate the business problem in plain language.

Include:

- What the user asked for.
- Who the interface is for.
- What problem the design should solve.
- What is currently unclear, if anything.

Rules:

- Use user-facing language.
- Do not describe implementation tasks.

## 3. Proposed Experience

Purpose: summarize the proposed design direction.

Include:

- The primary experience ARIA recommends.
- Why this design fits the problem.
- What the user should be able to accomplish.

Rules:

- Explain the design as a product experience.
- Avoid schema language.

## 4. User Goals

Purpose: list the outcomes the design supports.

Format:

```markdown
- [goal]
```

Rules:

- Goals are outcomes, not buttons or components.
- Keep the list short enough for human review.

## 5. Information Hierarchy

Purpose: explain what information matters most.

Include:

- Highest-priority information.
- Supporting information.
- Information hidden until needed.

Rules:

- Explain priority in plain language.
- Do not specify technical data models.

## 6. Layout Direction

Purpose: describe the proposed structure of the interface.

Include:

- Main areas of the page.
- Scanning order.
- Any major layout trade-offs.
- Desktop, tablet, and mobile direction when relevant.

Rules:

- Describe the layout conceptually.
- Do not prescribe CSS, components, or framework details.

## 7. Key Workflows

Purpose: explain the main user journeys.

Format:

```markdown
### [Workflow Name]

1. [step]
2. [step]
3. [step]
```

Rules:

- Focus on workflows the user cares about.
- Include edge workflows only when they affect approval.

## 8. Actions and Decisions

Purpose: show what users can do and which actions matter most.

Include:

- Primary actions.
- Secondary actions.
- Dangerous or irreversible actions.
- Decisions that need explicit approval.

Rules:

- Dangerous actions must be called out clearly.
- If action permission is unclear, ask before approval.

## 9. States

Purpose: describe non-happy-path experiences.

Include:

- Loading.
- Empty.
- Error.
- Permission denied.
- Offline or unavailable, when relevant.
- Success or completion, when relevant.

Rules:

- Keep state descriptions understandable to non-technical reviewers.
- State gaps should be visible before approval.

## 10. Refactor Notes

Purpose: only used when the Design Proposal is for an existing page refactor.

Include:

- What stays the same.
- What changes.
- What is intentionally out of scope.
- Current UX gaps this proposal fixes.

Rules:

- Preserve existing behavior unless the proposal explicitly changes it.
- Do not include this section for new feature proposals unless useful.

## 11. Project Context Used

Purpose: only used when the Design Proposal is for a new page in an existing project.

Include:

- Project context artifact reference, when available.
- Existing routes or navigation patterns used.
- Existing layout shell or page structure used.
- Nearby pages or features used as reference.
- Existing components or patterns the proposal reuses.
- Existing auth, roles, data, API, or client support that affects the page.
- Inferred project behavior that still needs confirmation.

Rules:

- Use this section to show which project facts shaped the proposal.
- Do not replace design intent with project facts.
- Label inferred behavior when the code or UI does not prove intent.
- Do not include this section for greenfield new features unless useful.

## 12. Open Questions

Purpose: list remaining questions blocking approval.

Question types:

- `Design-Framing Questions`: missing choices about audience, interface form, depth, main interaction, data scenario, or scope.
- `Open Product Questions`: missing choices about domain behavior, permissions, data visibility, destructive actions, states, or v1 boundaries.

Format:

```markdown
## Design-Framing Questions

### [Number]. [Decision Name]

Question: [plain-language question]
Recommendation: [option letter]

| Option | Choice | Impact |
| --- | --- | --- |
| A | [recommended or viable choice] | [effect on scope, UX, API, risk, or timeline] |
| B | [alternative choice] | [effect on scope, UX, API, risk, or timeline] |

Reply format: `1A` or `accept recommendation`

## Open Product Questions

### [Number]. [Decision Name]

Question: [plain-language question]
Recommendation: [option letter]

| Option | Choice | Impact |
| --- | --- | --- |
| A | [recommended or viable choice] | [effect on scope, UX, API, risk, or timeline] |
| B | [alternative choice] | [effect on scope, UX, API, risk, or timeline] |

Reply format: `1A` or `accept recommendation`
```

Rules:

- Design-framing questions are minimal by default and should appear only when the request or project context is too vague to produce a useful proposal.
- For target-project workflows, inspect project context first and do not ask framing questions already answered by the repo.
- If open questions materially affect the design, stop and ask before approval.
- If questions are low-risk assumptions, label them clearly.
- Use selectable options for questions that need user input.
- Provide a recommendation unless ARIA has no defensible preference.
- Keep options mutually exclusive when possible.
- Explain the impact of each option in one sentence.
- Allow compact replies such as `1A, 2B, 3A` or `accept recommendations`.
- After the user answers, update this proposal first and remove or resolve the answered question before asking for approval again.
- For required-preview work, render or re-render the HTML Preview after answers are applied and before final approval.
- Do not ask the user to write a new prompt when choosing between known options.

## 13. Visual Review

Purpose: capture visual review context before approval.

Include:

- Whether visual review was used.
- Renderer used, such as HTML Preview or Figma.
- Preview reference, when available.
- Visual confidence rating and reason.
- Visual review feedback that affected the proposal.
- Skip reason, when visual review was not used.

Rules:

- HTML Preview is preferred for developer workflows.
- Visual review is required by default for existing page refactors, new pages inside existing projects, dense operational screens, dashboards, tables, and navigation or information hierarchy changes.
- Visual review may be skipped only for copy-only, schema-only, behavior-only changes with no material visual consequence, or when the user explicitly asks to skip it.
- If visual review is skipped, record the reason.
- Do not request final approval for required-preview work until the preview is rendered or the user explicitly accepts a skip.
- Do not describe required visual review as merely useful, optional, or recommended.
- If required visual review is pending, keep `status: draft` and record `Visual review status: required, pending render` or equivalent.
- If the proposal is approved, the Visual Review section must show either a reviewed preview reference or an explicit skip reason.
- For required-preview work, the preview should cover the primary screen plus key state and interaction surfaces, not only the happy path.
- If important states or risky interactions are omitted from the preview, record the omission in the confidence reason.
- Visual review artifacts are rendered from the Design Proposal and are not production code.
- Do not edit HTML Preview directly. Update the Design Proposal, then have Codex re-render the preview.
- Do not include production implementation details.

## 14. Approval Notes

Purpose: capture the human approval decision.

Include:

- Approved by.
- Approval date.
- Required revisions, if any.
- Notes that must be preserved during UISpec compilation.

Rules:

- ARIA may compile a UISpec only after approval.
- Approval applies to the design intent, not implementation details.
- Approval permits UISpec compilation only; it does not authorize production implementation.
- Approval is invalid if material open questions remain unresolved.
- Approval is invalid for required-preview work while visual review is pending.
