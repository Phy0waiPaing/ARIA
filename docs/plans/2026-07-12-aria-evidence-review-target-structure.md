# ARIA Evidence Review And Target Structure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate target-project artifacts under `.aria/<feature>/` and make ARIA review gates depend on demonstrable preview behavior, deterministic evidence, readable typography, and artifact persistence.

**Architecture:** Keep ARIA docs-first and retain one pre-approval Review phase. Target artifacts become feature-centric under `.aria/<feature>/`; deterministic checks produce boolean evidence that can block the gate, while weighted criteria remain for UI/UX judgment.

**Tech Stack:** Markdown methodology, YAML review policy, HTML/CSS/lightweight JavaScript previews, Git and browser/Playwright verification.

## Global Constraints

- Do not add a CLI, runtime, plugin system, or new artifact type.
- Design Proposal remains the human-facing source of design intent.
- HTML Preview remains rendered review output, not production code.
- UISpec remains the coding-agent implementation contract.
- Critical interactions must work in the preview or be explicitly marked not demonstrated.
- Objective failures cannot be hidden by a weighted score.

---

### Task 1: Feature-Centric Target Artifact Structure

**Files:** `docs/project-structure.md`, core workflows, prompts, schemas, and artifact policy.

- [x] Replace scattered target paths with `.aria/<feature>/...` paths.
- [x] Document canonical filenames for context, proposal, preview, review, UISpecs, contracts, and package.
- [x] Require `.aria/` to be Git-trackable unless the user explicitly chooses local-only artifacts.
- [x] Search for stale target paths and verify none remain.

### Task 2: Executable Preview Evidence

**Files:** `visual-review-workflow.md`, `docs/workflows/design-v1.md`, `prompts/designer.md`, `schemas/design-proposal-v1.md`.

- [x] Require central approval-relevant controls to work with lightweight preview behavior.
- [x] Allow `.aria/<feature>/preview/interactions.js` when interaction is required.
- [x] Require non-demonstrated interactions to be labeled in the proposal and review.
- [x] Require click and keyboard verification for demonstrated interactions.
- [x] Prevent static controls from receiving full interaction scores.

### Task 3: Deterministic Review Evidence And Honest Gates

**Files:** `policies/review/default.yaml`, `prompts/reviewer.md`, and workflow docs.

- [x] Add boolean checks for proposal structure, artifact persistence, rendering, console, overflow, typography, viewports, and critical interactions.
- [x] Define readable typography floors and blocking issue identifiers.
- [x] Require reviewers to evaluate fresh evidence rather than generator claims.
- [x] Return failed reviews to Proposal/Preview and preserve resolved findings on rerun.
- [x] Reserve `PASS 100` for evidence-complete reviews with no notes.

### Task 4: Cross-Document Verification

- [x] Search for stale target paths.
- [x] Verify review weights total 100.
- [x] Verify all approval paths pass through Review.
- [x] Run `git diff --check`.
- [x] Review the final diff and preserve unrelated changes.
