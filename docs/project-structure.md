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
- Do not add runtime, plugin, CLI, or top-level workflow engine folders until automation work begins.
- Keep examples separate from methodology docs if examples are introduced later.

## Target Project Repository

Target projects using ARIA should store generated artifacts near the product code they describe.

Recommended structure:

```text
target-project/
  docs/
    aria-context/
      [feature-name].project-context.md
    design-proposals/
      [feature-name].proposal.md
    uispecs/
      [feature-name].target.uispec.md
      [page-name].current.uispec.md
    aria-reviews/
      [feature-name].review.md
    work-contracts/
      [artifact-name].work-contract.md
    design-packages/
      [feature-name]/
        handoff.md
        review.json
  preview/
    [feature-name]/
      index.html
      styles.css
      assets/
```

Rules:

- Store generated artifacts in the target project, not the ARIA methodology repository.
- Use project context capture before designing a new page in an existing project.
- Keep Design Proposal as the human-approved design intent.
- Keep UISpec as the implementation contract.
- Keep HTML Preview as rendered visual review output.
- Keep ARIA Review as persisted review findings and gate result.
- Keep Design Package as a handoff bundle.
- Keep Work Contract as artifact governance.

## Artifact Paths

Use these target-project conventions unless a project already has stronger local conventions:

| Artifact | Path |
| --- | --- |
| Project Context Capture | `docs/aria-context/[feature-name].project-context.md` |
| Design Proposal | `docs/design-proposals/[feature-name].proposal.md` |
| Current-State UISpec | `docs/uispecs/[page-name].current.uispec.md` |
| Target UISpec | `docs/uispecs/[feature-name].target.uispec.md` |
| ARIA Review | `docs/aria-reviews/[feature-name].review.md` |
| HTML Preview | `preview/[feature-name]/index.html` and `preview/[feature-name]/styles.css` |
| Work Contract | `docs/work-contracts/[artifact-name].work-contract.md` |
| Design Package | `docs/design-packages/[feature-name]/` |

## What Not To Add Yet

Do not add these folders to the ARIA repository until the methodology proves the need:

```text
runtime/
skills/
plugins/
templates/
cli/
```

These belong to future automation phases, not the current docs-first structure.

## Decision Rule

If a file defines ARIA's reusable method, schema, prompt, or policy, it belongs in the ARIA repository.

If a file describes one product, page, feature, preview, review, or handoff, it belongs in the target project repository.
