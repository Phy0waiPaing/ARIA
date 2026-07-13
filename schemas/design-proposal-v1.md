# Design Proposal v1

Design Proposal is the human-facing artifact between ARIA and the user.

It explains the proposed user experience in plain language so the user can approve the design before ARIA compiles a UISpec for Codex.

## Core Rule

The user approves the Design Proposal, not the UISpec.

The Design Proposal should be understandable without knowing ARIA schemas, frontend architecture, or implementation details.

For target-project workflows, the Design Proposal is a persisted file artifact. A chat summary can help review, but it does not replace the proposal file.

## Required Structure

Every Design Proposal v1 document must include these sections in order.

Required section names must match this schema. A proposal may add feature-specific subsections, but it must not rename, split, replace, or silently omit a required section. Sections marked as conditional may be omitted when they do not apply.

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

- Interface type: `App UI`, `Marketing`, or `Hybrid`.
- Highest-priority information.
- Supporting information.
- Information hidden until needed.
- What the user should notice first, second, and third.
- The one thing the screen or flow should make memorable.

Rules:

- Explain priority in plain language.
- Do not specify technical data models.
- For app UI, favor task clarity, density, and calm hierarchy over decorative composition.
- For marketing UI, favor a clear first-viewport composition, brand signal, and action path.
- For hybrid UI, state which parts follow app rules and which parts follow marketing rules.

## 6. Layout Direction

Purpose: describe the proposed structure of the interface.

Include:

- Main areas of the page.
- Scanning order.
- Any major layout trade-offs.
- Desktop, tablet, and mobile direction when relevant.
- What layout pattern is intentionally reused from the target project.
- What would make the layout feel generic or AI-generated if left unchecked.

Rules:

- Describe the layout conceptually.
- Do not prescribe CSS, components, or framework details.
- Cards, panels, badges, icons, and decorative surfaces must earn their role.
- Dense app screens should organize a primary workspace, navigation/context, and one clear accent rather than becoming a mosaic of decorative cards.

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
- Include the user's expected emotional arc when it affects UX: what should feel clear, safe, urgent, calm, or resolved.
- Mention what happens in the first five seconds of use when first impression matters.

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
- Describe what the user sees for each state, not only what the backend does.
- Empty states should provide context and the next useful action when one exists.
- Error, conflict, destructive, offline, and permission states should avoid implying valid empty data.

Recommended state coverage table:

```markdown
| Surface | Loading | Empty | Error | Success | Partial/Offline | Permission/Read-only |
| --- | --- | --- | --- | --- | --- | --- |
| [surface] | [what user sees] | [what user sees] | [what user sees] | [what user sees] | [what user sees] | [what user sees] |
```

## 10. Interaction and Accessibility Intent

Purpose: make key interaction, keyboard, and accessibility expectations visible before implementation.

Include:

- Primary action behavior and feedback.
- Dialog, drawer, tab, table, filter, form, wizard, or destructive-confirmation behavior when central to the proposal.
- Which central interactions the HTML Preview must demonstrate.
- Which interactions, if any, may remain `not demonstrated` and why that does not block approval.
- Keyboard and focus expectations for critical workflows.
- Label, status, contrast, and non-color communication expectations.
- Touch target and mobile interaction expectations when relevant.

Rules:

- Keep this at the design-intent level.
- Do not specify implementation libraries.
- Do not defer accessibility to implementation if it changes the approved UX.

## 11. AI Slop and Generic-UI Risk

Purpose: identify design risks that would make the proposal feel generic, decorative, or poorly matched to the product.

Include:

- Known generic patterns to avoid for this feature.
- Any places where cards, icons, gradients, large radius, shadows, centered layouts, or generic copy would weaken the UX.
- How the proposal stays specific to the product and target users.

Rules:

- For app UI, flag decorative card mosaics, ornamental icons, vague dashboard widgets, and mood copy.
- For marketing UI, flag generic hero copy, weak brand signal, busy imagery behind text, and feature grids without narrative purpose.
- Do not add visual novelty unless it supports the product goal.

## 12. Refactor Notes

Purpose: only used when the Design Proposal is for an existing page refactor.

Include:

- What stays the same.
- What changes.
- What is intentionally out of scope.
- Current UX gaps this proposal fixes.

Rules:

- Preserve existing behavior unless the proposal explicitly changes it.
- Do not include this section for new feature proposals unless useful.

## 13. Project Context Used

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

## 14. Open Questions

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

### Material Questions (CLI)

When ARIA is run through the v0 CLI, questions that must pause the workflow must
also be represented in this restricted fenced-YAML block. The Markdown question
sections remain the human-facing explanation; this block is only the selectable
runtime contract.

```yaml
questions:
  - id: data-source
    material: true
    prompt: Which data source should the dashboard use?
    choices:
      - id: existing-monitoring-api
        label: Existing monitoring API
      - id: proposed-new-api
        label: Proposed new API
```

Rules:

- The heading must be exactly `### Material Questions (CLI)`.
- Question and choice IDs must use lowercase kebab-case.
- Each question must set `material: true` and include one or more choices.
- The CLI does not parse general YAML, nested metadata, recommendations, or free-form answers from this block.
- Omit this subsection when no material question remains.

## 15. Visual Review

Purpose: capture visual review context before approval.

Include:

- Whether visual review was used.
- Renderer used, such as HTML Preview or Figma.
- Preview reference, when available.
- Interaction script reference, when available.
- Critical interaction demonstration status: `demonstrated`, `not demonstrated`, `not applicable`, or `blocked`.
- Visual confidence rating and reason.
- Design Review artifact reference and gate result, when review has run.
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

## 16. Approval Notes

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
