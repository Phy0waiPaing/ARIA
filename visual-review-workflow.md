# ARIA Visual Review Workflow

This document defines ARIA's optional visual review layer.

The default renderer is HTML Preview. Figma remains an optional renderer for teams that require Figma-based review. Future renderers may include Penpot, AI-generated mockups, or other visual design tools.

ARIA should remain renderer-agnostic. The workflow depends on visual validation, not on a specific visual tool.

## Purpose

The Design Proposal explains the intended experience in plain language.

The Visual Review artifact helps the user inspect layout, hierarchy, spacing, density, workflow direction, and action discoverability before ARIA compiles the UISpec for Codex.

## Core Rule

Visual Review does not replace ARIA, does not replace the Design Proposal, and does not replace the UISpec.

Visual Review artifacts are disposable validation aids. They are not production code and are not the system of record.

Source of truth:

- Design Proposal: human-approved product and UX intent.
- HTML Preview: rendered visual review artifact for developer workflows.
- UISpec: implementation contract compiled from approved design intent.
- Production code: owned by Codex and the target application.

The HTML Preview is a render of the Design Proposal. It is never edited manually.

Codex may render the HTML Preview artifact for ARIA. Rendering the preview does not make Codex responsible for design decisions.

## Artifact Audiences

| Artifact | Audience | Purpose |
| --- | --- | --- |
| Requirement | Human and ARIA | Business need |
| Design Proposal | Human and ARIA | Design discussion and approval |
| HTML Preview | Human and ARIA | Default visual validation |
| Figma Draft | Human and ARIA | Optional plugin-based visual validation |
| UISpec | Codex and engineers | Implementation contract |
| Code | Runtime and users | Product behavior |

## Primary Workflow

Recommended path:

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Render HTML Preview (optional but recommended)
  -> Human Approval
  -> UISpec Compilation
  -> Codex Implementation
  -> ARIA Review
```

Simple path:

```text
Requirement
  -> Discovery
  -> Design Proposal
  -> Human Approval
  -> UISpec Compilation
  -> Codex Implementation
  -> ARIA Review
```

For existing page refactors:

```text
Existing Page
  -> Current-State Capture
  -> Refactor Design Proposal
  -> Render HTML Preview (optional but recommended)
  -> Human Approval
  -> Target UISpec Compilation
  -> Codex Refactor
  -> ARIA Review
```

For simple changes, ARIA may skip the HTML Preview and proceed directly from Design Proposal to UISpec after approval.

## Renderer Policy

The Visual Review layer may support multiple renderers.

Current renderers:

- HTML Preview: default renderer.
- Figma: optional renderer.

Future renderers may include:

- Penpot.
- AI-generated mockups.
- Other visual design tools.

Renderer choice must not change the ARIA contract. The Design Proposal remains the human discussion artifact, and the UISpec remains the implementation contract.

## When To Use Visual Review

Use Visual Review when a picture would materially improve approval confidence.

Good cases:

- Layout-heavy pages.
- Dashboard, table, or dense operations screens.
- Navigation or information hierarchy changes.
- Existing page refactors where the user needs to compare current and proposed structure.
- Workflows where action placement or information density is the main design risk.
- Stakeholder review before implementation.

Skip Visual Review when:

- The change is copy-only.
- The design is already obvious.
- The user wants a fast text-only UISpec.
- The page is mostly backend behavior with little UI consequence.

## HTML Preview

HTML Preview is the default visual review renderer.

It exists to:

- Visualize the Design Proposal.
- Allow human review before UISpec compilation.
- Demonstrate layout, hierarchy, spacing, and interaction direction.
- Help developers review design intent in Git-friendly local artifacts.

The HTML Preview is not production code. It is a rendered visual review artifact used only for design validation.

Core rules:

- The preview is rendered from the latest Design Proposal.
- If a preview already exists, overwrite it.
- Do not create versioned preview folders such as `v1`, `v2`, or `final`.
- Git provides history.
- The preview only represents the latest design.
- Never edit the preview directly.
- Any design change must be made in the Design Proposal, then Codex should re-render the preview.

## HTML Preview Input

Required input:

```text
docs/design-proposals/[feature-name].proposal.md
```

Optional input:

```text
docs/uispecs/[feature-name].current.uispec.md
screenshots or references from the existing page
design-system documentation
existing application references
```

## HTML Preview Output

Render:

```text
preview/
  [feature-name]/
    index.html
    styles.css
```

Optional:

```text
preview/
  [feature-name]/
    assets/
```

The preview should demonstrate:

- Layout.
- Information hierarchy.
- Primary sections.
- Component placement.
- Important interaction states.

The preview should avoid:

- Backend logic.
- API calls.
- Authentication.
- Production architecture.
- Framework-specific code.

## Repository Structure

Target projects using ARIA should allow temporary visual review artifacts:

```text
repo/
  docs/
    design-proposals/
    uispecs/
  preview/
    [feature-name]/
      index.html
      styles.css
```

The `preview/` folder contains temporary review artifacts. It is not the implementation source.

## Preview Rules

HTML Preview should:

- Be readable directly from local files or a simple static server.
- Keep behavior lightweight and illustrative.
- Use realistic content only when it improves review quality.
- Label assumptions that are not settled in the Design Proposal.
- Prefer clarity over polish.
- Represent the latest Design Proposal only.

HTML Preview should not:

- Introduce new product behavior.
- Add unapproved workflows.
- Encode production data models.
- Choose frontend frameworks or component libraries.
- Become a shadow implementation.
- Be edited manually as a source document.

## Visual Confidence

Every Visual Review artifact should include a confidence rating.

Format:

```text
Visual Confidence: high | medium | low

Reason:
- [reason]
```

Use `high` when:

- The proposal maps to existing product patterns.
- No new workflow behavior is being invented.
- Layout hierarchy is straightforward.
- Required states are clear.

Use `medium` when:

- Multiple reasonable layout hierarchies exist.
- Some visual assumptions are needed.
- The workflow is clear but density or grouping needs human judgment.

Use `low` when:

- Key product behavior is unclear.
- The proposal leaves major layout decisions unresolved.
- Existing patterns conflict.
- The preview should be treated as exploratory.

## Human Review

The user reviews:

- Visual hierarchy.
- Information density.
- Workflow.
- Navigation.
- Layout.
- Discoverability of actions.

The user should not need to review the UISpec before approving the design direction.

## Revision Flow

When the user gives feedback on a Visual Review artifact, do not patch the UISpec directly.

Use this loop:

```text
Design Proposal
  -> Codex re-renders HTML Preview
  -> Review Again
```

Rules:

- Feedback that changes UX intent must update the Design Proposal.
- Feedback that only changes visual presentation may update the Design Proposal's visual direction, then Codex re-renders the HTML Preview.
- UISpec compilation happens only after design approval.
- If feedback creates new ambiguity, ARIA asks before revising.

## Approval Rule

ARIA compiles the UISpec only after design approval.

Design approval may come from:

- Design Proposal only.
- Design Proposal plus HTML Preview.
- Design Proposal plus another optional renderer output.

If HTML Preview is used, approval covers both:

- The Design Proposal's product intent.
- The HTML Preview's layout and hierarchy direction.

The UISpec remains the machine-facing contract generated from the approved design intent.

## Figma Renderer

Figma is optional. Use it only when the team needs Figma-based collaboration, stakeholder review, or downstream design tooling.

If Figma is used, organize it by repository rather than by feature.

Default rule:

```text
Figma file = repository
Figma page = feature or screen
Frames = current, proposal, review notes, approved
```

This avoids creating one Figma file per feature and keeps ARIA renderer-agnostic.

Recommended target-repo reference path:

```text
docs/figma/[project-name].figma.md
```

The Figma reference file should point to the repository master file and any relevant feature pages. It is a visual reference, not source of truth.

## Handoff To Codex

After approval, ARIA compiles the UISpec.

Codex should receive:

```text
docs/uispecs/[feature-name].target.uispec.md
preview/[feature-name]/index.html, if available
preview/[feature-name]/styles.css, if available
optional renderer reference, if available
```

Codex should implement the UISpec and use the HTML Preview only for visual alignment.

If the preview and UISpec disagree, the approved Design Proposal should be used to resolve intent before implementation continues.

## Prompt Pattern

Use this when asking Codex to render ARIA's HTML Preview artifact:

```text
Use ARIA from D:\Nemo\Projects\ARIA.

Render ARIA's HTML Preview from:
docs/design-proposals/[feature-name].proposal.md

Follow the Visual Review workflow in:
D:\Nemo\Projects\ARIA\visual-review-workflow.md

Render or overwrite:
preview/[feature-name]/index.html
preview/[feature-name]/styles.css

Do not change product behavior.
Do not compile or modify the UISpec.
Do not implement production code.
Do not make new UX decisions.
Do not add backend logic, API calls, authentication, production architecture, or framework-specific code.
Do not create versioned preview folders.
Do not edit the preview as source; render it from the latest Design Proposal.
Mark any visual assumptions clearly.
Include a visual confidence rating and reason.
```

Use this when asking Codex to implement after approval:

```text
Read docs/uispecs/[feature-name].target.uispec.md.
Use preview/[feature-name]/index.html and preview/[feature-name]/styles.css as visual references if they exist.
Implement the UI from the approved UISpec.
Do not change UX decisions unless asked.
If the preview and UISpec disagree, pause and resolve intent from the approved Design Proposal.
```
