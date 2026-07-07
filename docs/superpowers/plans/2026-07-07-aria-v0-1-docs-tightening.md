# ARIA v0.1 Docs Tightening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten ARIA v0.1 into a docs-only methodology foundation for producing Codex-ready UISpecs.

**Architecture:** The repository remains documentation-only. `README.md` orients users, `workflow.md` defines the lifecycle, `schemas/uispec-v1.md` defines the handoff contract, `prompts/` defines ARIA operating roles, and `design-system/` defines reusable design guidance.

**Tech Stack:** Markdown documentation, Git, PowerShell verification commands.

---

## File Structure

- Modify: `README.md` - project overview, v0.1 scope, repository map, and roadmap.
- Modify: `workflow.md` - requirement-to-UISpec lifecycle and phase outputs.
- Modify: `schemas/uispec-v1.md` - fillable UISpec contract.
- Create: `prompts/analyst.md` - intake and clarification prompt.
- Modify: `prompts/designer.md` - design and UISpec generation prompt.
- Create: `prompts/reviewer.md` - implementation review prompt.
- Modify: `design-system/principles.md` - canonical design principles.
- Create: `design-system/components.md` - design-level component guidance.
- Delete: `design-system/design-principles.md` - duplicate principles source.

## Task 1: Align Repository Overview

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Replace README with v0.1 docs-only overview**

Use `apply_patch` to replace `README.md` with:

```markdown
# ARIA

**AI Requirements & Interface Architect**

ARIA is a docs-first design workflow for turning business requirements into structured UI specifications that implementation agents such as Codex can build from.

ARIA is not a coding assistant. It designs the user experience, defines the interface contract, and reviews implementation fidelity.

## v0.1 Focus

v0.1 establishes the methodology before automation.

Included:

- ARIA responsibilities and boundaries.
- A requirement-to-UISpec workflow.
- A fillable UISpec v1 contract.
- Role prompts for analysis, design, and review.
- Design principles and component guidance.

Not included yet:

- Production frontend code.
- CLI tools or schema validators.
- Visual renderer automation.
- Visual validation automation.
- Example UISpecs.

## Core Workflow

```text
Feature Request
  -> Discovery
  -> Clarification
  -> Design Proposal
  -> Human Approval
  -> UISpec
  -> Codex Implementation
  -> Optional ARIA Review
```

## Responsibilities

ARIA:

- Understands business requirements.
- Asks clarifying questions when requirements are incomplete.
- Defines purpose, user goals, information hierarchy, layout, states, and actions.
- Produces implementation-independent UISpecs.
- Reviews implemented UI against approved UISpecs.

Codex:

- Reads approved UISpecs.
- Implements the UI in the target project.
- Follows project architecture and design-system constraints.
- Avoids changing UX decisions unless asked.

## Repository Structure

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

## Document Map

- `workflow.md` defines the full ARIA lifecycle.
- `schemas/uispec-v1.md` defines the handoff contract between ARIA and Codex.
- `prompts/analyst.md` guides requirement discovery and clarification.
- `prompts/designer.md` guides UX design and UISpec generation.
- `prompts/reviewer.md` guides review of implemented UI against an approved UISpec.
- `design-system/principles.md` defines ARIA's design principles.
- `design-system/components.md` defines framework-agnostic component guidance.

## Roadmap

### v0.1 - Foundation

- Define ARIA's responsibilities.
- Define the design workflow.
- Define UISpec v1.
- Define role prompts.
- Define design principles and component guidance.

### v0.2 - Examples and Patterns

- Add example UISpecs.
- Add reusable page patterns.
- Refine prompts from real usage.

### v0.3 - Review and Validation

- Add implementation review workflows.
- Add UISpec-to-implementation checklists.
- Explore visual validation support.

### Later

- Explore automated visual renderer output.
- Explore schema validation.
- Explore automation around ARIA handoffs.
```

- [ ] **Step 2: Verify README has no stale file references**

Run:

```powershell
rg "camera|analyst.md|reviewer.md|components.md|examples" README.md
```

Expected: references are only to real v0.1 files or to future example work.

## Task 2: Tighten Workflow

**Files:**
- Modify: `workflow.md`

- [ ] **Step 1: Replace workflow with phase contract**

Use `apply_patch` to replace `workflow.md` with sections for: Requirement, Discovery, Design Proposal, Human Approval, UISpec Compilation, Codex Implementation, Optional ARIA Review, Existing Page Refactor Workflow, and Handoff Rules.

- [ ] **Step 2: Verify workflow uses ASCII characters only**

Run:

```powershell
rg -P "[^\\x00-\\x7F]" workflow.md
```

Expected: no matches.

## Task 3: Make UISpec v1 Fillable

**Files:**
- Modify: `schemas/uispec-v1.md`

- [ ] **Step 1: Replace schema with fillable contract**

Use `apply_patch` to replace `schemas/uispec-v1.md` with required sections, field guidance, and rules for implementation-independent content.

- [ ] **Step 2: Verify required UISpec sections exist**

Run:

```powershell
rg "^## (1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)\\." schemas\\uispec-v1.md
```

Expected: 16 numbered section headings.

## Task 4: Add Role Prompts

**Files:**
- Create: `prompts/analyst.md`
- Modify: `prompts/designer.md`
- Create: `prompts/reviewer.md`

- [ ] **Step 1: Add analyst prompt**

Create `prompts/analyst.md` with role, inputs, process, readiness criteria, and output format for discovery and clarification.

- [ ] **Step 2: Replace designer prompt**

Replace `prompts/designer.md` with role, required inputs, process, ask-before-generating rules, UISpec output rules, and non-responsibilities.

- [ ] **Step 3: Add reviewer prompt**

Create `prompts/reviewer.md` with role, review inputs, review criteria, output format, and boundaries against code-style review.

- [ ] **Step 4: Verify prompt files exist**

Run:

```powershell
Get-ChildItem -Name prompts
```

Expected: `analyst.md`, `designer.md`, and `reviewer.md`.

## Task 5: Consolidate Design System Docs

**Files:**
- Modify: `design-system/principles.md`
- Create: `design-system/components.md`
- Delete: `design-system/design-principles.md`

- [ ] **Step 1: Keep principles canonical**

Update `design-system/principles.md` so it is the single principles source and is ASCII-clean.

- [ ] **Step 2: Add component guidance**

Create `design-system/components.md` with design-level guidance for navigation, tables, forms, filters, cards, dialogs, status indicators, tabs, empty states, error states, and permission states.

- [ ] **Step 3: Remove duplicate principles file**

Run:

```powershell
Remove-Item -LiteralPath design-system\\design-principles.md
```

- [ ] **Step 4: Verify design-system files**

Run:

```powershell
Get-ChildItem -Name design-system
```

Expected: `components.md` and `principles.md`.

## Task 6: Final Verification

**Files:**
- Inspect all changed Markdown files.

- [ ] **Step 1: Check workspace status**

Run:

```powershell
git status --short
```

Expected: changed docs only.

- [ ] **Step 2: Scan for non-ASCII markdown characters**

Run:

```powershell
rg -P "[^\\x00-\\x7F]" README.md workflow.md schemas prompts design-system
```

Expected: no matches.

- [ ] **Step 3: Scan for example references that imply examples exist now**

Run:

```powershell
rg "camera-detail|camera-list|example page specification|example UISpec" README.md workflow.md schemas prompts design-system
```

Expected: no matches except roadmap language that examples are future work.

- [ ] **Step 4: Review diff**

Run:

```powershell
git diff -- README.md workflow.md schemas prompts design-system docs
```

Expected: docs-only changes that match the approved design.
