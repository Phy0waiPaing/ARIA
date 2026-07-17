# UISpec v1

UISpec is the implementation-independent contract between ARIA and Codex.

A UISpec describes what interface should be built and why. It should not prescribe framework-specific implementation details.

The UISpec is not the primary human review artifact. Humans approve the Design Proposal; ARIA compiles the UISpec after approval.

## Core Rule

A complete UISpec must let Codex implement the UI without making new UX decisions.

Every target UISpec must be compiled from an approved Design Proposal.

A target UISpec must be a build contract, not a design summary. It must convert approved intent into concrete requirements for sections, content, data meaning, conditional rendering, states, actions, responsive behavior, accessibility, and acceptance checks.

If Codex could implement two meaningfully different interfaces from the same UISpec, the UISpec is too vague.

Every target UISpec must explicitly define:

- Required sections and what each section contains.
- Data inputs and how missing, zero, stale, unavailable, or unproduced values should be displayed.
- Visibility and conditional rendering rules.
- Interaction behavior and feedback.
- Required states for the page and for important sections.
- Responsive and accessibility behavior.
- Visual alignment requirements when HTML Preview exists.
- Do-not-do rules that prevent common misinterpretations.
- Acceptance criteria that can be checked after implementation.

## Required Structure

Every UISpec v1 document must include these sections in order.

## 1. Metadata

Purpose: identify the specification and its review status.

Required fields:

```yaml
name:
version:
status: draft | current-state | proposed | approved | revised
created:
updated:
owner:
sourceRequest:
sourceDesignProposal:
projectContext:
visualReference:
implementationTarget:
```

Rules:

- `name` should describe the interface, not the implementation route.
- `status` must be `approved` before Codex treats a target UISpec as source of truth.
- `current-state` documents an existing interface before refactor and is not an implementation target.
- `proposed` describes a target design that still needs human approval.
- `sourceRequest` should briefly capture the original business request.
- `sourceDesignProposal` should point to the approved proposal used to compile this UISpec.
- `projectContext` should point to the Project Context Capture when the UISpec is for a new page in an existing project.
- `visualReference` must point to rendered HTML Preview files when preview exists, was required, or was used for approval.
- If required preview was explicitly skipped, `visualReference` must reference the approved Design Proposal's skip reason instead of remaining blank.
- `implementationTarget` should name the route, page, component, or workflow Codex is expected to implement when known.
- If `visualReference` and the UISpec disagree, use the approved Design Proposal to resolve intent before implementation continues.

Future Work Contract metadata may wrap a UISpec, but it is not required for UISpec v1.

Example future wrapper:

```yaml
contract:
  owner: ARIA Designer
  consumers:
    - Codex
    - Claude Code
  acceptance:
    - Responsive behavior is defined.
    - Existing project components are reused where required.
    - Accessibility expectations are explicit.
    - Design review has passed.
```

Rules:

- Work Contract metadata must not replace any required UISpec section.
- Acceptance rules must be checkable against the UISpec, Design Proposal, or review artifacts.
- If an acceptance rule changes UX intent, update the Design Proposal before compiling or revising the UISpec.

## 2. Design Summary

Purpose: summarize the design direction in a compact form.

Required fields:

```yaml
purpose:
primaryUser:
primaryGoal:
complexity: low | medium | high
keyDesignPrinciple:
```

Rules:

- `purpose` must be one sentence.
- `primaryGoal` should describe the user's outcome, not a button click.

## 3. Purpose

Purpose: explain why the interface exists.

Include:

- One primary purpose statement.
- What problem this interface solves.
- What this interface intentionally does not solve.

Rules:

- Do not list actions as the purpose.
- If the page has multiple unrelated purposes, split the design.

## 4. User Context

Purpose: define who uses the interface and under what conditions.

Include:

- Primary user.
- Secondary users.
- Usage frequency.
- Environment or workflow context.
- User knowledge level.

Rules:

- Prefer real roles over generic labels like "user" when known.
- Note unknowns explicitly if they affect design confidence.

## 5. User Goals

Purpose: list outcomes users need from the interface.

Format:

```markdown
- Goal: [outcome]
  Priority: primary | secondary
  Notes: [constraints or context]
```

Rules:

- Goals are outcomes, not UI controls.
- Each primary action should support at least one user goal.

## 6. Information Architecture

Purpose: define logical information groups before layout.

Include:

- Information groups.
- Relative priority.
- Relationships between groups.
- Data that should be hidden until needed.

Rules:

- This section should not define columns, breakpoints, or component names.
- Group information by user meaning, not backend structure.

## 7. Layout

Purpose: describe the screen structure.

Include:

- Overall layout model.
- Main regions.
- Region priority.
- Scanning order.
- Persistent or sticky areas, if any.
- Density expectation: compact | balanced | spacious.
- Visual reference notes from HTML Preview when available.
- Required deviations from preview, if any.

Rules:

- Keep this framework-agnostic.
- Describe spatial intent, not CSS implementation.
- If preview was used, name the visual qualities Codex must preserve, such as density, grouping, hierarchy, and action placement.

## 8. Sections

Purpose: define the functional areas of the interface.

Format:

```markdown
### [Section Name]

Purpose:
Priority: primary | secondary | supporting
Required Content:
- [specific text, data, control, or region]
Data Inputs:
- [field, endpoint, prop, static copy, or unknown]
Data Meaning Rules:
- [how values should be interpreted]
Visibility Rules:
- [when shown, hidden, collapsed, disabled, or replaced]
Interaction Rules:
- [click, keyboard, refresh, filter, disclosure, navigation behavior]
State Rules:
- Loading:
- Empty:
- Error:
- Partial:
- Permission:
Responsive Rules:
- Desktop:
- Tablet:
- Mobile:
Accessibility Rules:
- [labels, focus, live regions, heading/landmark expectations]
Do Not:
- [explicit anti-requirements]
Acceptance Checks:
- [checkable outcomes]
```

Rules:

- Every section must support the page purpose.
- Avoid decorative sections without user value.
- Every visible section must have a section contract.
- Do not use vague content such as "show relevant details" without naming the details.
- If a section is optional or conditional, define the condition.
- If a section from the preview should not be implemented, say so explicitly.

## 9. Data And Content Rules

Purpose: define data semantics that affect UI behavior.

Include:

- Required data inputs.
- Optional data inputs.
- Derived values.
- Null, missing, zero, empty-string, stale, unavailable, and unproduced meanings.
- Formatting rules for dates, counts, identifiers, statuses, units, and labels.
- Copy rules for unknown, unavailable, not reported, and permission-limited values.

Format:

```markdown
| Data Item | Source | Meaning | Display Rule | Must Not |
| --- | --- | --- | --- | --- |
| [name] | [source] | [semantic meaning] | [UI behavior] | [forbidden interpretation] |
```

Rules:

- If `0` may mean unavailable, unproduced, not reported, or unknown, define that explicitly.
- Do not let Codex infer missing telemetry as a real value.
- Do not show ratios, gauges, totals, or percentages unless numerator and denominator semantics are proven.
- Label inferred or unresolved data rules.
- Data rules that affect a specific section must also be referenced in that section contract.

## 10. Components

Purpose: identify reusable UI concepts needed by the design.

Format:

```markdown
### [Component Concept]

Used For:
Required Content:
Behavior:
States:
Accessibility:
Do Not:
```

Rules:

- Use design-level names such as table, status indicator, dialog, filter bar, tabs, or form.
- Do not require a specific component library.
- Components must refer back to section contracts; they should not become detached implementation suggestions.

## 11. User Flows

Purpose: describe important interaction paths.

Format:

```markdown
### [Flow Name]

Trigger:
Preconditions:
Steps:
1. [step]
2. [step]
Success Result:
Failure Result:
State Changes:
Acceptance Checks:
```

Rules:

- Include common flows and critical edge flows.
- Include failure and partial-success paths when they change what the user sees.
- Do not describe implementation events unless the user experiences them.

## 12. Actions

Purpose: define all user operations and their priority.

Format:

```markdown
| Action | Priority | Trigger Location | Preconditions | Result | Feedback | Confirmation |
| --- | --- | --- | --- | --- | --- | --- |
| [name] | primary | [where] | [condition] | [outcome] | [visible response] | yes/no |
```

Priority values:

- Primary: main action that advances the user's goal.
- Secondary: useful supporting action.
- Dangerous: destructive or irreversible action.

Rules:

- Dangerous actions must define confirmation and recovery expectations.
- Do not create actions that do not map to a user goal.
- Every action must map to a section contract.
- If an action is conditional, define when it appears, disables, or becomes unavailable.
- If an action navigates, define valid and invalid destination behavior.

## 13. States

Purpose: define what the interface shows outside the ideal loaded state.

Must include:

- Loading.
- Empty.
- Error.
- Partial or degraded.
- Offline or unavailable.
- Permission denied.
- Stale or last-known data, when relevant.
- Success or completion, when relevant.

Format:

```markdown
| State | Applies To | User Sees | Available Actions | Recovery Path | Acceptance Check |
| --- | --- | --- | --- | --- | --- |
| [state] | [page/section/action] | [visible UI] | [actions] | [path] | [check] |
```

Rules:

- Empty states should guide the next useful action.
- Error states should explain what happened and what the user can do.
- Partial states must preserve successful evidence and label missing evidence.
- Permission states must not render blank protected surfaces.

## 14. Permissions

Purpose: define role-based visibility and action access.

Include:

- Roles.
- Visible sections per role.
- Available actions per role.
- Disabled or hidden behavior.
- Copy for access denial.
- Data redaction or omission rules.

Rules:

- If permissions are unknown, state what must be clarified before implementation.
- Do not leave permission-sensitive actions unspecified.
- Do not substitute fake empty data for denied data.

## 15. Responsive Rules

Purpose: define how the interface adapts across viewport sizes.

Include:

- Desktop behavior.
- Tablet behavior.
- Mobile behavior.
- Content priority when space is constrained.
- Navigation or action changes by size.
- Overflow and horizontal scrolling rules.
- Minimum critical information that must remain visible.

Rules:

- Responsive rules should preserve the primary workflow.
- Do not hide critical information without an alternate access path.
- For dense operational pages, name what may collapse and what must remain visible.

## 16. Accessibility

Purpose: define accessibility expectations.

Include:

- Keyboard navigation.
- Focus order.
- Screen reader labels and landmarks.
- Live region or status announcement behavior.
- Contrast expectations.
- Error messaging behavior.
- Motion or animation constraints.

Rules:

- Interactive elements must be keyboard reachable.
- State and status changes must be perceivable without relying on color alone.
- If preview demonstrated interactions, the same interactions must have keyboard paths in implementation.

## 17. Acceptance Criteria

Purpose: give Codex and reviewers concrete checks for whether the implementation satisfies the UISpec.

Format:

```markdown
| Area | Criterion | Verification |
| --- | --- | --- |
| [section/state/action] | [expected outcome] | code inspection | browser check | test | manual review |
```

Must include criteria for:

- Primary workflow.
- Each primary section.
- Each primary action.
- Critical state behavior.
- Permission behavior.
- Responsive behavior.
- Accessibility behavior.
- Data semantics that could be misimplemented.
- Visual preview alignment when preview exists.

Rules:

- Acceptance criteria must be checkable.
- Do not use vague criteria such as "looks good" or "works properly."
- If an implementation can pass while violating design intent, the criterion is too weak.

## 18. Implementation Notes

Purpose: capture constraints Codex should know without changing the design.

May include:

- Existing app conventions to follow.
- Known data availability constraints.
- Integration boundaries.
- Copy or terminology constraints.

Rules:

- Do not place UX decisions here.
- Do not choose frameworks, libraries, or internal architecture unless the target project already requires them.

## Refactor UISpec Rules

When ARIA is used for an existing page refactor, use two UISpecs:

```text
.aria/[feature-name]/current.uispec.md
.aria/[feature-name]/target.uispec.md
```

### Current-State UISpec

Use `status: current-state`.

Purpose:

- Document what the existing page currently does.
- Capture observed sections, components, actions, states, permissions, and responsive behavior.
- Identify UX gaps or unclear behavior as observations.

Rules:

- Describe the current page faithfully.
- Do not improve the design in this artifact.
- Label inferred behavior when the source does not prove intent.
- This document is a baseline, not a Codex implementation target.

### Target UISpec

Use `status: approved` after compiling from an approved Design Proposal.

Purpose:

- Define the desired post-refactor experience.
- Preserve existing behavior unless the target UISpec explicitly changes it.
- Explain which current-state gaps the approved Design Proposal addresses.
- Provide implementation-ready section, data, state, action, and acceptance contracts.

Rules:

- Reference the approved Design Proposal.
- Reference Project Context Capture when the target UISpec is for a new page in an existing project.
- Reference Current-State UISpec when the target UISpec changes an existing page.
- Codex implements from the approved target UISpec only.
- Do not introduce unrelated workflows.
- Do not remove existing user value unless the refactor intent explicitly calls for it.
- Implementation notes may reference existing code constraints but must not override the target UX.
