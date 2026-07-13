# ARIA Roadmap

This roadmap describes the direction for ARIA beyond the current v0.1 methodology.

The current repository remains docs-first. Roadmap items describe where ARIA should evolve, not features that exist today.

## Vision

ARIA is evolving toward an AI Design Orchestrator.

ARIA turns ambiguous product requirements or existing interface context into approved design intent, rendered visual review artifacts, implementation-ready UISpecs, and design packages that coding agents can consume with minimal ambiguity.

ARIA intentionally owns the pre-development lifecycle. Production implementation remains delegated to Codex or another coding agent.

## Principles

### Intent First

Every feature starts by understanding why it exists before deciding how it should look or behave.

Intent should become a durable artifact instead of remaining hidden in chat history.

### Artifact First

ARIA agents communicate through version-controlled artifacts.

The core artifact chain is:

```text
Requirement, Existing Project, or Existing Page
  -> Discovery
  -> Project Context or Current-State Capture, when needed
  -> Design Proposal
  -> HTML Preview
  -> Review
  -> Human Approval
  -> UISpec
  -> Design Package
  -> Coding Agent
```

Artifacts define responsibility boundaries between humans, ARIA, renderers, reviewers, and implementation agents.

### HTML Preview First

HTML Preview is the default visual review renderer because it is executable, browser-renderable, diffable, version-controlled, and friendly to coding agents.

HTML Preview does not replace the Design Proposal or UISpec. It is rendered output used for visual confidence.

### Model Agnostic

ARIA should produce artifacts that can be consumed by different coding agents.

Supported consumers may include:

- Codex.
- Claude Code.
- Cursor.
- Future coding agents.

ARIA should not bind its core methodology to one model vendor.

### Separation Of Responsibilities

ARIA owns:

- Requirement understanding.
- Product and UX decisions.
- Design Proposal generation.
- Visual review direction.
- UISpec compilation.
- Design package generation.
- Design review of the proposal and preview before human approval.

Coding agents own:

- Production code.
- Refactoring.
- Tests.
- Pull requests.
- Framework-specific implementation choices within the approved UISpec.

## Current Core Artifacts

The current ARIA methodology is centered on these artifacts:

```text
Project Context Capture
Design Proposal
HTML Preview
UISpec
Review Policy
Design Review Artifact
```

For existing page refactors, ARIA may also produce:

```text
Current-State UISpec
Target UISpec
```

## Future Design Package

A Design Package bundles the artifacts needed by a coding agent.

Example package shape:

```text
.aria/
  feature-name/
    design-proposal.md
    target.uispec.md
    review.md
    preview/
      index.html
      styles.css
      interactions.js
    design-package/
      handoff.md
      review.json
```

The package should not create a new source of truth. It should collect approved artifacts and explain how a coding agent should consume them.

Source of truth remains:

- Design Proposal for human-approved intent.
- UISpec for implementation.
- HTML Preview for visual alignment.
- Production code for runtime behavior.

## Future Work Contracts

Work Contracts are a future artifact governance layer.

A Work Contract does not replace the UISpec. It wraps an artifact and defines who owns it, who consumes it, what inputs produced it, and what acceptance rules make it valid.

Example:

```yaml
artifact: .aria/orders/target.uispec.md
artifactType: UISpec
owner: ARIA Designer
consumers:
  - Codex
  - Claude Code
acceptance:
  - Responsive behavior is defined.
  - Existing DataTable component reuse is required where available.
  - Accessibility expectations are explicit.
  - Design review has passed.
```

Work Contracts should remain future-facing until the core artifacts and Design Package flow are stable.

## Roadmap Phases

### Phase 1: Methodology Foundation

Status: current and manually validated.

- Design Proposal as the human-facing approval artifact.
- UISpec as the implementation contract.
- HTML Preview as the default visual review renderer.
- New page in existing project flow with project context capture.
- Existing page refactor flow with current-state capture.
- One policy-driven Review phase evaluating Design Proposal plus HTML Preview before human approval.
- Persisted Design Review artifact with weighted UI/UX criteria, blocking issues, and `PASS`, `PASS_WITH_NOTES`, `FAIL`, or `BLOCKED` gate result.
- UISpec structural validation after approval without a second AI design-review phase.
- A manual Role CRUD spike also exercised downstream implementation review and ended with `PASS_WITH_NOTES`; that remains evidence, not ARIA v1 scope.

### Phase 2: Design Package

Goal: make handoff to coding agents explicit and repeatable.

- Define project structure boundaries.
- Define package contents.
- Add Design Package schema.
- Add handoff notes.
- Include structured Design Review outputs in the package.
- Keep Design Proposal and UISpec as sources of truth.
- Keep HTML Preview as rendered output.

### Phase 3: Artifact Governance

Goal: add Work Contracts around major artifacts.

- Define artifact governance policy.
- Define Work Contract schema.
- Attach contracts to UISpec, HTML Preview, and review artifacts.
- Validate acceptance rules before handoff.
- Make artifact ownership and consumers explicit.

### Phase 4: Knowledge And Reuse

Goal: help ARIA reuse real project context.

- Component discovery.
- Project context capture.
- Existing page analysis.
- Pattern reuse.
- Design memory.
- Project knowledge.

### Phase 5: Automation And Integrations

Goal: automate stable parts of the methodology.

- CLI commands such as `aria design`, `aria review`, and `aria export`.
- Renderer integrations.
- Coding-agent exporters.
- GitHub or CI hooks.
- Optional plugin architecture for replaceable capabilities.

## Out Of Scope For Current Methodology

ARIA should not currently implement:

- Production React or Next.js generation.
- Backend generation.
- API generation.
- Database generation.
- Test generation.
- PR creation.
- Deployment.
- Full plugin runtime.
- CLI orchestration.

Those responsibilities belong either to future automation phases or to implementation agents.

## Long-Term Goal

ARIA provides a model-agnostic, artifact-first design orchestration framework that turns ambiguous product requirements and existing interface context into governed design packages that coding agents can implement without making new UX decisions.
