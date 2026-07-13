# ARIA Project Structure

This document defines where ARIA-owned methodology files live and where ARIA-generated project artifacts should live.

## Core Boundary

ARIA has two locations in a workflow:

- ARIA methodology repository.
- Target project repository.

The ARIA methodology repository defines how ARIA works.

The target project repository contains the artifacts produced for a real product or feature.

## ARIA Repository

The ARIA repository owns reusable methodology assets:

```text
ARIA/
  README.md
  package.json
  src/
  test/
  manifest.md
  workflow.md
  visual-review-workflow.md
  docs/
    ROADMAP.md
    architecture.md
    project-structure.md
    workflows/
      design-v1.md
  schemas/
    design-proposal-v1.md
    uispec-v1.md
    work-contract-v1.md
    design-package-v1.md
  prompts/
    analyst.md
    designer.md
    reviewer.md
    exporter.md
  design-system/
    principles.md
    components.md
    patterns.md
  policies/
    accessibility.md
    review/
      default.yaml
    visual-review.md
    artifact-governance.md
```

Rules:

- Keep the ARIA repository methodology-focused.
- Do not store real project Design Proposals, UISpecs, previews, or design packages here.
- `docs/workflows/` may contain manually executable methodology workflows.
- The v0 runtime lives under `src/`; it mirrors the documented workflow but does not replace it as the source of truth.
- Do not add plugin systems, additional runtimes, or general workflow-engine folders until a real use case proves the need.
- Keep examples separate from methodology docs if examples are introduced later.

## Target Project Repository

Target projects using ARIA should store every generated artifact under one feature-centric `.aria/` boundary.

Recommended structure:

```text
target-project/
  .aria/
    [feature-name]/
      workflow-state.json
      project-context.md
      design-proposal.md
      current.uispec.md
      target.uispec.md
      review.md
      preview/
        index.html
        styles.css
        interactions.js
        assets/
      work-contracts/
        [artifact-name].work-contract.md
      design-package/
        handoff.md
        review.json
```

Rules:

- Store generated artifacts in the target project, not the ARIA methodology repository.
- Keep all artifacts for one feature or test slug together under `.aria/[feature-name]/`.
- `workflow-state.json` is operational metadata only. It stores phase progression, selected answers, approval time, and artifact mode; it never replaces the proposal, review, or UISpec.
- Treat `.aria/` as version-controlled project content by default. It must not be ignored accidentally.
- A newly generated artifact may be `trackable-untracked` before commit. An ignored required artifact blocks the Review gate unless the user explicitly chose local-only artifacts.
- Record an explicit local-only decision in `project-context.md` and `review.md`; do not infer it from `.gitignore`.
- New runs must use this structure. Existing `docs/aria-*`, `docs/design-proposals`, `docs/uispecs`, and `preview/` artifacts may be read as legacy inputs but should not be copied forward as new outputs.
- Use project context capture before designing a new page in an existing project.
- Keep Design Proposal as the human-approved design intent.
- Keep UISpec as the implementation contract.
- Keep HTML Preview as rendered visual review output.
- Keep Design Review as persisted proposal-plus-preview findings and gate result.
- Keep Design Package as a handoff bundle.
- Keep Work Contract as artifact governance.

## Artifact Paths

Use these target-project conventions unless a project already has stronger local conventions:

| Artifact | Path |
| --- | --- |
| Workflow State | `.aria/[feature-name]/workflow-state.json` |
| Project Context Capture | `.aria/[feature-name]/project-context.md` |
| Design Proposal | `.aria/[feature-name]/design-proposal.md` |
| Current-State UISpec | `.aria/[feature-name]/current.uispec.md` |
| Target UISpec | `.aria/[feature-name]/target.uispec.md` |
| Design Review | `.aria/[feature-name]/review.md` |
| HTML Preview | `.aria/[feature-name]/preview/index.html` and `.aria/[feature-name]/preview/styles.css` |
| Preview Interactions | `.aria/[feature-name]/preview/interactions.js`, when critical interactions must be demonstrated |
| Work Contract | `.aria/[feature-name]/work-contracts/[artifact-name].work-contract.md` |
| Design Package | `.aria/[feature-name]/design-package/` |

## What Not To Add Yet

Do not add these folders to the ARIA repository until the methodology proves the need:

```text
skills/
plugins/
templates/
```

These belong to future automation phases, not the current docs-first structure.

## Decision Rule

If a file defines ARIA's reusable method, schema, prompt, or policy, it belongs in the ARIA repository.

If a file describes one product, page, feature, preview, review, or handoff, it belongs in the target project repository.
