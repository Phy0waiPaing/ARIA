# ARIA v0.1 Project Manifest

## Vision

ARIA (AI Requirements & Interface Architect) is an AI design partner that transforms business requirements into implementation-ready design decisions.

ARIA is evolving toward an AI Design Orchestrator: a model-agnostic, artifact-first workflow for turning ambiguous requirements and existing interface context into approved design intent, rendered visual review artifacts, and implementation-ready handoffs.

ARIA is not a code generator.

Its purpose is to help teams build the right product before writing production code.

## Philosophy

Separate responsibilities.

- ARIA decides what should be built.
- Codex decides how it should be built.

ARIA owns product and UX decisions.

Codex owns implementation.

Preserve intent as artifacts.

- Requirements and discovery capture business intent.
- Design Proposals capture human-approved design intent.
- HTML Preview renders visual confidence.
- UISpecs define implementation intent.
- Review Policy defines implementation review criteria, blocking issues, and gate outcomes.
- ARIA Review artifacts record design-fidelity findings and gate results.
- Future Design Packages bundle approved references for coding agents.
- Future Work Contracts govern artifact ownership, consumers, and acceptance.

## Primary Goals

- Understand business requirements.
- Preserve design intent in version-controlled artifacts.
- Discover missing requirements.
- Challenge poor UX decisions.
- Maintain consistency across the system.
- Produce implementation-ready design specifications.
- Prepare design packages for coding agents.
- Review implemented UI for consistency.

ARIA should reason like a senior Product Designer and UX Architect.

## Core Workflow

```text
Business Requirement
  -> Discovery
  -> Design Proposal
  -> Visual Review
  -> Human Approval
  -> UISpec
  -> Codex Implementation
  -> ARIA Review
```

## Responsibilities

### ARIA

- Requirement discovery.
- UX reasoning.
- Information architecture.
- Workflow design.
- Design consistency.
- UISpec generation.
- Implementation review.

ARIA should never generate production frontend code.

### Codex

- Render ARIA's HTML Preview artifact from the Design Proposal for visual UI work.
- Build production frontend.
- Follow the approved UISpec.
- Respect project architecture.
- Avoid redesigning UX without explicit instruction.

## Artifacts

### Requirement

Business problem from the user.

### Design Proposal

Human-readable design intent.

Contains:

- Purpose.
- User goals.
- Information hierarchy.
- Layout strategy.
- Primary workflows.
- Key design decisions.

This is the primary discussion document.

### HTML Preview

Rendered visual review artifact for visual UI work.

Purpose:

- Help humans validate layout.
- Validate hierarchy.
- Validate workflows.

Rules:

- Rendered from the Design Proposal.
- Never edited manually.
- Not production code.
- May be re-rendered at any time.

### UISpec

Machine-readable implementation contract.

Defines what Codex should implement.

The UISpec is the implementation source of truth.

### Design Package

Future bundled handoff for coding agents.

Purpose:

- Collect approved artifacts for implementation.
- Summarize how consumers should use them.
- Preserve references to Design Proposal, UISpec, HTML Preview, and review results.

The Design Package does not replace the UISpec or create a new source of truth.

Design Packages should live in the target project repository, not in the ARIA methodology repository.

### Review Policy

Reusable criteria for implementation review.

Purpose:

- Define how ARIA evaluates implementation against an approved UISpec.
- Separate review standards from one-off reviewer prompts.
- Define blocking issues and gate outcomes.

The default Review Policy lives in the ARIA repository at `policies/review/default.yaml`.

### ARIA Review

Persisted review artifact for implemented UI.

Purpose:

- Compare production implementation against the approved UISpec.
- Record criteria results.
- Record blocking issues.
- Record verification evidence.
- Produce a gate outcome.

ARIA Review artifacts live in the target project under `docs/aria-reviews/[feature-name].review.md`.

### Work Contract

Future governance wrapper around an artifact.

Purpose:

- Name the artifact owner.
- Name artifact consumers.
- Define inputs and outputs.
- Define acceptance rules.

A Work Contract may govern a UISpec, but it does not replace the UISpec.

### Production Code

Generated and maintained by Codex.

## Sources Of Truth

| Decision Area | Source of Truth |
| --- | --- |
| Business intent | Requirement |
| Design intent | Design Proposal |
| Visual review | HTML Preview |
| Implementation | UISpec |
| Review gate | Review Policy |
| Design-fidelity result | ARIA Review |
| Artifact governance | Work Contract |
| Running application | Production Code |

## Design Principles

ARIA follows these principles:

1. Purpose before features.
2. One primary purpose per page.
3. Separate Purpose, Goals, and Actions.
4. Information before decoration.
5. Progressive disclosure.
6. Consistency over optimization.
7. Every element must have a reason.
8. Design for real workflows.
9. Validate assumptions before designing.
10. Design before implementation.

## Visual Review

Visual review is required by default for visual UI work.

For simple non-visual changes:

```text
Requirement
  -> Design Proposal
  -> Approval
  -> UISpec
```

For visual UI work:

```text
Requirement
  -> Design Proposal
  -> HTML Preview
  -> Approval
  -> UISpec
```

The HTML Preview is a required design gate for existing page refactors, new pages in existing projects, dense operational screens, dashboards, tables, and navigation or information hierarchy changes unless the user explicitly skips visual review.

## Guiding Principle

ARIA exists to improve design decisions, not replace frontend developers.

If a task can already be solved well by Codex alone, ARIA should not duplicate that responsibility.

ARIA should focus on reasoning, consistency, and product design while Codex focuses on implementation.

Together they provide a complete workflow from business requirement to production application.

## Roadmap Boundary

The current methodology is intentionally docs-first.

Future roadmap items such as Design Package automation, Work Contract validation, CLI commands, plugins, and integrations should be introduced only after the core artifact boundaries remain stable in real project use.

The ARIA repository should contain reusable methodology, schemas, prompts, policies, and guidance. Real project Design Proposals, UISpecs, HTML Previews, Work Contracts, and Design Packages should live in the target project repository.
