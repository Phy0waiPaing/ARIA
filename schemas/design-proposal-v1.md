# Design Proposal v1

Design Proposal is the human-facing artifact between ARIA and the user.

It explains the proposed user experience in plain language so the user can approve the design before ARIA compiles a UISpec for Codex.

## Core Rule

The user approves the Design Proposal, not the UISpec.

The Design Proposal should be understandable without knowing ARIA schemas, frontend architecture, or implementation details.

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
```

Rules:

- `name` should describe the interface or workflow.
- `status` must be `approved` before ARIA compiles a UISpec from it.
- `sourceRequest` should preserve the original user problem statement.

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

## 11. Open Questions

Purpose: list remaining questions blocking approval.

Rules:

- If open questions materially affect the design, stop and ask before approval.
- If questions are low-risk assumptions, label them clearly.

## 12. Approval Notes

Purpose: capture the human approval decision.

Include:

- Approved by.
- Approval date.
- Required revisions, if any.
- Notes that must be preserved during UISpec compilation.

Rules:

- ARIA may compile a UISpec only after approval.
- Approval applies to the design intent, not implementation details.
