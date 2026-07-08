# Artifact Governance Policy

This policy defines how ARIA treats artifact ownership, consumers, acceptance, and source-of-truth boundaries.

It supports future Work Contracts and Design Packages.

## Core Rule

Every artifact should have a clear owner, consumer, purpose, and boundary.

## Artifact Roles

| Artifact | Role |
| --- | --- |
| Requirement | Business intent |
| Design Proposal | Human-approved design intent |
| HTML Preview | Rendered visual review output |
| UISpec | Implementation contract |
| Review Findings | Implementation fidelity review |
| Work Contract | Artifact governance wrapper |
| Design Package | Handoff bundle |
| Production Code | Runtime behavior |

## Ownership Rules

- ARIA owns Design Proposals, UISpecs, review findings, and future Work Contracts.
- Codex or another coding agent owns production implementation.
- Target projects own generated artifacts for their own features.
- The ARIA methodology repository owns schemas, prompts, policies, and workflow docs.

## Consumer Rules

- Humans consume Design Proposals and visual review artifacts.
- Coding agents consume approved UISpecs.
- Reviewers consume approved UISpecs and implementation evidence.
- Exporters consume approved artifacts and produce Design Packages.

## Acceptance Rules

Acceptance rules should be:

- Checkable.
- Tied to evidence.
- Scoped to the governed artifact.
- Written before handoff when possible.

Acceptance rules should not:

- Introduce new UX decisions after approval.
- Override the approved Design Proposal.
- Override the approved UISpec.
- Convert package notes into source of truth.

## Conflict Resolution

When artifacts disagree:

1. Use the Requirement to clarify business intent.
2. Use the approved Design Proposal to clarify design intent.
3. Use the approved UISpec to clarify implementation intent.
4. Treat HTML Preview as visual reference only.
5. Treat Design Package notes as handoff guidance only.
6. Reopen design review when intent cannot be resolved.

## Package Rules

Design Packages should:

- Reference approved artifacts.
- Preserve source-of-truth boundaries.
- Explain how a coding agent should consume the handoff.
- Include review status when available.

Design Packages should not:

- Add new product scope.
- Change approved UX decisions.
- Replace the UISpec.
- Store hidden requirements.
