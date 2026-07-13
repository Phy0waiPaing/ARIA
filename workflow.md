# ARIA Workflow

This document defines how ARIA turns a business problem or existing page into a Design Proposal and HTML Preview, reviews that design package against explicit UI and UX criteria, obtains human approval, then compiles the approved proposal into a UISpec that Codex can implement.

ARIA may later bundle approved artifacts into a Design Package. The package is a handoff bundle, not a new source of truth.

ARIA is not a prompt engine. ARIA is a design partner with a repeatable handoff process.

## Overview

ARIA supports three v0.1 workflows:

- New feature workflow: requirements become an approved Design Proposal, pass through visual review when the UI changes materially, then become a UISpec.
- Existing page refactor workflow: the current page is captured first, then a refactor Design Proposal is approved and compiled into a target UISpec.
- New page in existing project workflow: the project context is captured first, then a new-page Design Proposal is approved and compiled into a target UISpec.

The user reviews the Design Proposal, HTML Preview, and persisted Review result. Codex renders the preview artifact and consumes the UISpec.

Future Work Contracts may govern major artifacts by defining owners, consumers, inputs, outputs, and acceptance rules. Work Contracts wrap artifacts; they do not replace Design Proposal, HTML Preview, or UISpec.

ARIA v1 has one Review phase before human approval. It uses the explicit Review Policy at `policies/review/default.yaml` to evaluate the Design Proposal and HTML Preview together. UISpec structural validation follows approval; implementation conformance review is downstream and future-facing.

## Artifact Persistence Rule

When ARIA is used inside a target project, required artifacts must be written to the target project before ARIA asks for approval or moves to the next phase.

Chat summaries are allowed, but they do not replace persisted artifacts.

Rules:

- A Project Context Capture must be written before it is used as design context.
- A draft Design Proposal must be written before asking the user to approve it.
- A UISpec must be written only after the Design Proposal is approved.
- ARIA must report the artifact paths it wrote.
- ARIA must not say it will write artifacts after approval when those artifacts are required for approval.
- ARIA must not proceed to implementation from a chat-only Design Proposal.

## New Feature Workflow

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Render HTML Preview (required for material UI changes)
  -> Review
  -> Human Approval
  -> UISpec Compilation
  -> Design Package (future)
  -> Codex Implementation
```

## Existing Page Refactor Workflow

```text
Existing Page
  -> Current-State Capture
  -> Refactor Design Proposal
  -> Render HTML Preview
  -> Review
  -> Human Approval
  -> Target UISpec Compilation
  -> Design Package (future)
  -> Codex Refactor
```

## New Page In Existing Project Workflow

```text
Existing Project
  -> Project Context Capture
  -> New Page Design Proposal
  -> Render HTML Preview
  -> Review
  -> Human Approval
  -> Target UISpec Compilation
  -> Design Package (future)
  -> Codex Implementation
```

ARIA should not treat a new page in an existing project as a blank design exercise.

For new pages in existing projects, ARIA first captures the app context and nearby conventions, then proposes the new page in a human-facing Design Proposal.

ARIA should not treat an existing page refactor as a blank design exercise.

For refactors, ARIA first captures what exists, then proposes what should change in a human-facing Design Proposal.

## User Responsibilities

The user should only need to:

1. Describe the business problem.
2. Answer ARIA's questions if clarification is needed.
3. Review the Design Proposal, HTML Preview, and structured Review result, then approve or request changes.

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

ARIA uses two question types:

- Design-framing questions clarify the kind of experience to design, such as audience, interface form, depth, main interaction, scenario, and scope.
- Product decision questions resolve domain behavior inside a known feature, such as permissions, destructive actions, data visibility, and v1 boundaries.

Design-framing questions are minimal by default. ARIA asks them only when the request and available project context are too vague to produce a useful proposal. For target-project work, ARIA should inspect project context first and avoid asking questions already answered by the repo.

When ARIA knows the likely choices, it should ask decision questions with selectable answers rather than raw open-ended prompts.

Decision questions should include:

- A short decision name.
- A plain-language question.
- A recommended option, when ARIA has a defensible preference.
- Two to four mutually exclusive options.
- One-sentence impact for each option.
- A compact reply format such as `1A, 2B` or `accept recommendations`.

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
- Open questions, if any remain, preferably as selectable decision prompts.
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

- A persisted draft Design Proposal at `.aria/[feature-name]/design-proposal.md`.
- A short chat summary pointing to the proposal file.
- Trade-offs or alternatives when useful.
- Open questions as selectable decision prompts if approval would be premature.

## 5. HTML Preview

Codex renders ARIA's HTML Preview artifact from the latest Design Proposal when the work affects layout, hierarchy, density, navigation, or interaction state placement.

HTML Preview is required by default for:

- Existing page refactors.
- New pages inside existing projects.
- Layout-heavy pages.
- Dense admin, dashboard, table, or operations screens.
- Navigation or information hierarchy changes.
- Workflows where action placement or information density is the main design risk.

HTML Preview may be skipped only when the change is copy-only, schema-only, behavior-only with no visual consequence, or the user explicitly asks to skip visual review.

If ARIA skips HTML Preview, the Design Proposal must record the reason in the Visual Review section.

The HTML Preview is a rendered visual review artifact. It is a render of the Design Proposal, not an independently authored source document.

HTML Preview demonstrates:

- Layout.
- Information hierarchy.
- Section placement.
- Component placement.
- Important interaction states.

For required-preview work, the preview should be a compact review surface, not only a single happy-path screen. It should include:

- The primary screen or flow.
- The main create/edit/view interaction surface when one exists.
- Dangerous or irreversible action confirmation when one exists.
- Representative loading, empty, error, permission, and conflict states that materially affect layout or decision confidence.
- Protected, disabled, or read-only behavior when that behavior is important to the proposal.

For dense admin, dashboard, table, or operations screens, include small state or interaction panels when showing every state full-size would make the preview too large.

HTML Preview must avoid:

- Backend logic.
- API calls.
- Authentication.
- Production architecture.
- Framework-specific code.

The preview is not production code. It is a disposable visual review artifact.

ARIA must not request final design approval for required-preview work until the HTML Preview has been rendered or the user explicitly accepts a skip.

Output:

- `.aria/[feature-name]/preview/index.html`
- `.aria/[feature-name]/preview/styles.css`
- `.aria/[feature-name]/preview/interactions.js`, when critical interactions must be demonstrated.
- Optional assets under `.aria/[feature-name]/preview/assets/`

## 6. Review

ARIA evaluates the Design Proposal and HTML Preview as one design package before asking for final human approval.

The Review phase combines:

- Artifact checks: required files exist and the proposal and preview do not contradict each other.
- Browser checks: the preview renders, the primary workflow is reachable, and objective issues such as horizontal overflow are recorded.
- Interaction checks: every approval-relevant control is demonstrated through click or keyboard evidence, or explicitly marked `not demonstrated`.
- Typography checks: body, help, state, error, label, caption, and metadata text meet the review policy's readability floors.
- Persistence checks: required `.aria/` artifacts are tracked, trackable, or explicitly local-only rather than accidentally ignored.
- UI and UX evaluation: information architecture, visual hierarchy, interaction clarity, state coverage, accessibility, responsive behavior, design-system fit, and AI-slop risk.
- Gate decision: weighted score plus blocking issues produce `PASS`, `PASS_WITH_NOTES`, `FAIL`, or `BLOCKED`.

The reviewer first classifies the interface as `app_ui`, `marketing`, or `hybrid`, then applies the relevant interface-specific checks from `policies/review/default.yaml`.

Output:

- Persisted review artifact at `.aria/[feature-name]/review.md`.
- Criteria scores, blocking issues, acceptable design choices, unresolved decisions, verification evidence, and gate result.

Rules:

- `PASS` and `PASS_WITH_NOTES` may proceed to Human Approval.
- `FAIL` returns to the Design Proposal and HTML Preview phases for revision.
- `BLOCKED` requires missing review evidence before proceeding.
- Review findings do not directly redesign the preview. Design changes update the Design Proposal first, then Codex re-renders the preview.
- ARIA does not compile a UISpec or write production code during Review.
- ARIA v1 does not add separate AI review phases for UISpec and implementation.
- Objective checks are boolean evidence. A blocking failure cannot be offset by weighted design scores.
- A static control cannot receive full interaction credit.
- Review must evaluate the rendered artifact directly and must not rely on generator confidence or self-description.
- Review does not silently fix and erase a failure. It records `FAIL`, returns to Proposal or Preview, and records the resolved finding when Review runs again.

## 7. Human Approval

The user reviews the Design Proposal, the HTML Preview when required or used, and the persisted Review result. The user does not review the UISpec as the primary artifact.

The user may:

- Approve the proposal.
- Request changes.
- Reduce or expand scope.
- Ask ARIA to revisit discovery or design.

ARIA updates the Design Proposal until the user approves it.

ARIA must not ask for approval while the Review gate is `FAIL` or `BLOCKED`.

If the proposal contains selectable decision questions, the user may answer with compact choices such as `1A, 2B, 3A` or `accept recommendations`. ARIA should apply those choices to the Design Proposal before asking for approval again.

When answers resolve open decisions, ARIA updates the Design Proposal file first. For required-preview work, ARIA then renders or re-renders the HTML Preview and asks for approval from the updated proposal plus preview. ARIA must not compile a UISpec from a proposal that has just had decisions applied but has not passed the required preview gate.

Output:

- Approved Design Proposal, or revised Design Proposal file for another review.

If revisions are needed, ARIA updates the Design Proposal and Codex re-renders the HTML Preview before another review.

For required-preview work, approval must happen after preview review, not from the Design Proposal alone.

A Design Proposal must not use `status: approved` while required visual review is pending. If required preview is skipped, the approved proposal must record the explicit skip reason.

Design Proposal approval unlocks UISpec compilation only. It does not authorize production implementation. After approval, ARIA should compile the target UISpec, report the UISpec path, and stop unless the user separately asks to implement from the approved UISpec.

## 8. UISpec Compilation

After the Design Proposal is approved, ARIA compiles a UISpec using `schemas/uispec-v1.md`.

The UISpec must be:

- Implementation-independent.
- Complete enough for Codex to implement without making new UX decisions.
- Faithful to the approved Design Proposal.
- Consistent with ARIA design principles.
- Explicit about states, actions, permissions, and responsive rules.

Output:

- A complete UISpec v1 document for Codex at `.aria/[feature-name]/target.uispec.md`.

If HTML Preview was rendered, the target UISpec metadata must include `visualReference` paths to the preview files. If required preview was explicitly skipped, `visualReference` must reference the skip reason in the approved Design Proposal. Required-preview work must not leave `visualReference` blank.

After writing the UISpec, ARIA should ask for the next instruction. It must not phrase proposal approval as permission to both compile the UISpec and implement production code.

UISpec schema, completeness, and reference checks are compilation validation. They do not create a second AI design-review phase in ARIA v1.

## Existing Page Refactor Mode

Use this mode when the user asks to refactor, clean up, redesign, simplify, or improve an existing page.

ARIA may produce or maintain three different artifacts:

```text
.aria/[feature-name]/current.uispec.md
.aria/[feature-name]/design-proposal.md
.aria/[feature-name]/target.uispec.md
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
- Write the draft proposal file before asking for approval.
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

## New Page In Existing Project Mode

Use this mode when the user asks to add, create, design, or introduce a new page inside an existing application.

ARIA may produce or maintain these artifacts:

```text
.aria/[feature-name]/project-context.md
.aria/[feature-name]/design-proposal.md
.aria/[feature-name]/target.uispec.md
```

### Project Context Capture

The project context capture documents the app patterns that should shape the new page.

It should capture:

- Existing routes and navigation placement.
- Existing layout shell.
- Nearby pages or features the new page should match.
- Existing components, tables, forms, dialogs, toolbars, and state patterns.
- Existing auth, roles, or permissions.
- Existing data and API/client support when visible.
- Existing naming, copy, and visual conventions.
- Constraints or gaps that affect the new page.

Rules:

- Capture project facts before proposing the page.
- Label inferred behavior when the code or UI does not make intent explicit.
- Ask only for missing product intent that materially changes the design.
- Do not use project context capture as a replacement for the Design Proposal.
- Do not write production code during context capture.

### New Page Design Proposal

The new page Design Proposal defines the desired page experience for human approval.

Rules:

- Use `status: draft` until human approval.
- Write the draft proposal file before asking for approval.
- Include a `Project Context Used` section or reference `.aria/[feature-name]/project-context.md`.
- Reuse existing project patterns unless the proposal explicitly changes them.
- State which project conventions the new page follows.
- State open product questions before approval.
- Use `status: approved` only after human approval.

### Target UISpec

The target UISpec is compiled from the approved new page Design Proposal.

Rules:

- Use `status: approved`.
- Reference the approved Design Proposal.
- Reference project context when it constrains implementation.
- Preserve the approved proposal's design intent.

Codex should implement only from the approved target UISpec.

## Downstream: Codex Implementation

Codex implementation is outside ARIA v1's pre-development scope. It requires a separate user instruction after UISpec compilation.

Before implementation, future ARIA workflows may export a Design Package.

The package may include:

- Approved Design Proposal.
- Approved UISpec.
- HTML Preview, when available.
- Review Findings, when available.
- Handoff notes for the coding agent.
- Work Contracts, when available.

The package must not contradict the approved artifacts. If package notes conflict with the UISpec or Design Proposal, resolve the conflict before implementation begins.

Design Packages should be stored in the target project repository under `.aria/[feature-name]/design-package/`.

Codex consumes the approved UISpec and builds the UI in the target application.

For refactors, Codex consumes the approved target UISpec.

If an HTML Preview exists, Codex may use it as a visual reference only. The UISpec remains the implementation contract.

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

## Future: Implementation Conformance Review

Implementation conformance review may later compare implemented UI against the approved UISpec using a dedicated policy. It is distinct from the ARIA v1 Review phase, which evaluates the Design Proposal and HTML Preview before human approval.

ARIA should focus on:

- Missing sections or states.
- Incorrect action priority.
- Mismatched information hierarchy.
- Responsive or accessibility gaps.
- Deviations from approved UX decisions.
- Review-policy blocking issues.
- Verification evidence.

Future implementation conformance may produce a persisted artifact in the target project. Its policy and path should be finalized only after more downstream spikes demonstrate the evidence ARIA needs.

```text
.aria/[feature-name]/implementation-conformance.md
```

Gate outcomes:

- `PASS`: implementation satisfies the review policy with no blocking issues.
- `PASS_WITH_NOTES`: implementation satisfies the review policy, but non-blocking notes remain.
- `FAIL`: blocking issues or failed criteria require changes.
- `BLOCKED`: ARIA lacks enough implementation or verification evidence to decide.

Output:

- Conformance artifact tied to UISpec requirements and a future implementation policy.
- Criteria results.
- Blocking issues.
- Verification evidence.
- Gate result.
- Recommended design corrections, if needed.

## Handoff Rules

- ARIA designs; Codex builds.
- ARIA owns product and UX decisions; Codex owns rendered artifacts and implementation.
- Design Proposal is the human approval artifact.
- HTML Preview is the required rendered visual review artifact for refactors, new pages, and dense visual UI work unless explicitly skipped.
- UISpec is the implementation contract between ARIA and Codex.
- Review Policy defines the proposal-plus-preview design gate before human approval.
- Design Review is persisted as a target-project artifact.
- Implementation conformance review is future downstream scope and must use a separate policy.
- Design Package is a future handoff bundle, not a source of truth.
- Work Contract is a future artifact governance wrapper, not a replacement for UISpec.
- Figma is optional and should be treated as a renderer, not a core workflow dependency.
- ARIA asks before assuming when ambiguity affects UX.
- ARIA compiles UISpec only after Design Proposal approval.
- ARIA persists required artifacts before asking for approval or moving to the next phase.
- ARIA keeps target-project artifacts under `.aria/[feature-name]/` and verifies that required files are not accidentally ignored by Git.
- Codex asks before changing approved UX.
- If the preview and UISpec disagree, use the approved Design Proposal to resolve intent before implementation continues.
- Never edit the HTML Preview directly. Any design change must update the Design Proposal, then Codex re-renders the preview.
- For refactors, current-state capture documents the baseline, Design Proposal defines the human-approved change, and target UISpec defines the Codex contract.
- Implementation notes may describe constraints, but they must not smuggle in design decisions.
- Real project artifacts belong in the target project repository. The ARIA repository owns reusable methodology, schemas, prompts, and policies.
