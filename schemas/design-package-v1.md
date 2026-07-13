# Design Package v1

Status: future / experimental.

Design Package is a future handoff bundle for coding agents.

It does not replace Design Proposal, HTML Preview, UISpec, Review Findings, or Work Contracts. It collects approved artifacts and explains how consumers should use them.

## Core Rule

A Design Package bundles references. It must not create a new source of truth.

If package notes conflict with the approved Design Proposal or approved UISpec, resolve the conflict before implementation begins.

## Required Structure

Every Design Package v1 should include these files:

```text
.aria/[feature-name]/design-package/
  handoff.md
  review.json
```

Optional files:

```text
.aria/[feature-name]/design-package/
  manifest.yaml
  work-contract.md
```

The package may reference artifacts outside the package:

```text
.aria/[feature-name]/design-proposal.md
.aria/[feature-name]/project-context.md
.aria/[feature-name]/target.uispec.md
.aria/[feature-name]/preview/index.html
.aria/[feature-name]/preview/styles.css
.aria/[feature-name]/preview/interactions.js
.aria/[feature-name]/work-contracts/[artifact-name].work-contract.md
```

## 1. Package Metadata

Purpose: identify the package and its consumers.

Required fields:

```yaml
name:
version:
status: draft | ready | revised
created:
updated:
owner:
consumers:
  - Codex
```

Rules:

- `status` must be `ready` before a coding agent treats the package as handoff-ready.
- `owner` is responsible for package completeness.
- `consumers` should name coding agents or teams expected to use the package.

## 2. Artifact References

Purpose: list the approved artifacts included by reference.

Required fields:

```yaml
artifacts:
  designProposal:
  projectContext:
  uispec:
  htmlPreview:
  reviewFindings:
  workContracts:
```

Rules:

- `designProposal` must point to the approved Design Proposal.
- `projectContext` should point to Project Context Capture when the package is for a new page in an existing project.
- `uispec` must point to the approved target UISpec.
- `htmlPreview` is optional and visual only.
- `reviewFindings` is optional until structured review output exists.
- `workContracts` are optional until artifact governance is active.

## 3. Handoff Notes

Purpose: explain how the coding agent should consume the package.

Include:

- Primary implementation artifact.
- Project context reference, when available.
- Visual reference, if available.
- Constraints to preserve.
- Known open questions.
- Out-of-scope changes.

Rules:

- The approved UISpec must be the primary implementation artifact.
- Project Context Capture explains existing app conventions but must not add new UX decisions.
- Handoff notes must not add new UX decisions.
- If an open question affects UX, return to design review before implementation.

## 4. Review Summary

Purpose: record review readiness.

Format:

```json
{
  "status": "ready",
  "blockingIssues": [],
  "warnings": [],
  "acceptedRisks": []
}
```

Rules:

- `blockingIssues` must be empty before package status is `ready`.
- `warnings` may describe non-blocking risks.
- `acceptedRisks` must be explicitly approved by the user or project owner.

## Example Handoff

```markdown
# Orders Table Handoff

Status: ready
Owner: ARIA Designer
Consumers: Codex

## Primary Artifact

Implement from:

- `.aria/orders/target.uispec.md`

## Supporting References

- Design intent: `.aria/orders/design-proposal.md`
- Visual reference: `.aria/orders/preview/index.html`
- Visual styles: `.aria/orders/preview/styles.css`
- Interaction reference: `.aria/orders/preview/interactions.js`, when present

## Rules

- Use the UISpec as the implementation contract.
- Use the HTML Preview only for visual alignment.
- Do not change UX decisions without reopening design review.
- If references disagree, resolve intent from the approved Design Proposal before implementation continues.
```
