# ARIA v0.1 Docs Tightening Design

## Purpose

Tighten ARIA v0.1 into a docs-only methodology foundation that clearly defines how business requirements become Codex-ready UISpecs.

## Scope

This pass updates documentation and prompt artifacts only. It does not add automation, runnable tooling, Figma generation, visual validation, or example UISpecs.

## Goals

- Make the repository structure match the documented v0.1 purpose.
- Define a practical, fillable UISpec v1 contract.
- Separate ARIA responsibilities into clear role prompts.
- Keep one canonical design principles document.
- Add component guidance as design-system vocabulary, not implementation code.
- Remove stale references to files or capabilities that are not part of this pass.

## Non-Goals

- No production frontend code.
- No schema validator or CLI.
- No generated Figma artifacts.
- No example page specification yet.
- No implementation framework decisions.

## Proposed Repository Shape

```text
ARIA/
  README.md
  workflow.md
  prompts/
    analyst.md
    designer.md
    reviewer.md
  schemas/
    uispec-v1.md
  design-system/
    principles.md
    components.md
```

The existing `examples/` directory may remain empty for now, but README should not claim example files exist in v0.1.

## Document Responsibilities

### README.md

README should explain what ARIA is, what v0.1 includes, what it does not include, and how the docs fit together. It should describe ARIA as a design partner that produces UISpecs for Codex, not as a coding assistant or automation tool.

### workflow.md

Workflow should define the lifecycle from feature request through approval and Codex implementation. It should make clear when ARIA asks questions, when it drafts a design, when it emits a UISpec, and when Codex takes over.

### schemas/uispec-v1.md

UISpec v1 should become a fillable contract with required sections, guidance for what belongs in each section, and rules that keep it implementation-independent. It should be complete enough that Codex can implement without making new UX decisions.

### prompts/analyst.md

The analyst prompt should cover requirement intake, discovery questions, ambiguity detection, conflict detection, and readiness checks before design.

### prompts/designer.md

The designer prompt should cover translating clarified requirements into a structured UX design and final UISpec. It should define when to ask more questions instead of generating.

### prompts/reviewer.md

The reviewer prompt should cover checking an implementation against an approved UISpec. It should focus on UX fidelity, missing states, accessibility, and design consistency, not code style.

### design-system/principles.md

This should remain the canonical principles file. Duplicate shorter principle documents should be removed or merged into it.

### design-system/components.md

Component guidance should define reusable UI concepts and decision rules at a design level. It should avoid prescribing framework-specific components.

## Quality Bar

The tightened docs should be:

- Consistent: no duplicate or conflicting source-of-truth docs.
- Concrete: every role prompt should produce predictable output.
- Contractual: UISpec v1 should be precise enough for Codex handoff.
- Conservative: no v0.2 automation or examples sneaking into v0.1.
- ASCII-clean: markdown should avoid corrupted arrow or tree characters.

## Approval Criteria

This design is ready to implement when the user agrees that v0.1 should stay docs-only and that examples are intentionally excluded from this pass.
