# Work Contract v1

Status: future / experimental.

Work Contract is a future governance wrapper for ARIA artifacts.

It does not replace Design Proposal, HTML Preview, UISpec, or Review Findings. It defines how an artifact is owned, produced, consumed, and accepted.

## Core Rule

A Work Contract governs an artifact. It is not the artifact itself.

For example, a UISpec remains the implementation contract. A Work Contract around that UISpec defines ownership, consumers, inputs, outputs, and acceptance rules for the UISpec artifact.

## Required Structure

Every Work Contract v1 document should include these sections in order.

## 1. Metadata

Purpose: identify the governed artifact.

Required fields:

```yaml
artifact:
artifactType: design-proposal | html-preview | uispec | review-findings | design-package
version:
status: draft | active | retired
created:
updated:
owner:
```

Rules:

- `artifact` must point to the governed artifact.
- `artifactType` must describe the artifact role, not the file extension.
- `owner` is responsible for keeping the artifact valid.
- Work Contracts for current ARIA artifacts should remain optional until the Design Package flow is stable.

## 2. Purpose

Purpose: explain why the governed artifact exists.

Include:

- What decision or handoff the artifact supports.
- What the artifact is responsible for.
- What the artifact does not own.

Rules:

- Do not duplicate the full artifact content.
- State the artifact boundary clearly.

## 3. Inputs

Purpose: list the artifacts or context used to produce the governed artifact.

Format:

```yaml
inputs:
  - path:
    role:
    required: true | false
```

Rules:

- Inputs should be version-controlled paths when possible.
- External context should be named clearly when no path exists.
- Required inputs must be present before the artifact is considered valid.

## 4. Outputs

Purpose: list artifacts produced from or packaged with this artifact.

Format:

```yaml
outputs:
  - path:
    role:
```

Rules:

- Outputs must not create hidden sources of truth.
- If an output is rendered or derived, mark it as rendered or derived.

## 5. Consumers

Purpose: define who or what consumes the artifact.

Format:

```yaml
consumers:
  - name:
    type: human | aria | renderer | coding-agent | reviewer
    responsibility:
```

Rules:

- Consumers should describe how the artifact is used.
- Coding agents should consume the UISpec as the implementation contract.
- Humans should consume the Design Proposal as the approval artifact.

## 6. Acceptance

Purpose: define what must be true before the artifact can be used for its intended handoff.

Format:

```yaml
acceptance:
  - rule:
    evidence:
    required: true | false
```

Example for a UISpec:

```yaml
acceptance:
  - rule: Responsive behavior is defined for desktop, tablet, and mobile.
    evidence: Section 14 of the UISpec is complete.
    required: true
  - rule: Existing DataTable component reuse is required where available.
    evidence: Implementation Notes name the project component constraint.
    required: true
  - rule: Accessibility expectations are explicit.
    evidence: Section 15 of the UISpec is complete.
    required: true
  - rule: Design review has passed.
    evidence: Review Findings contain no high-severity open findings.
    required: true
```

Rules:

- Acceptance rules should be checkable.
- Acceptance rules should not smuggle in new design decisions after approval.
- If an acceptance rule changes UX intent, update the Design Proposal first.

## 7. Validation

Purpose: describe how the Work Contract can be checked.

Include:

- Manual checks.
- Automated checks, when available.
- Known limits.

Rules:

- Validation may be manual in early phases.
- Automated validation belongs in a future automation phase.

## Example: UISpec Work Contract

```yaml
artifact: .aria/orders/target.uispec.md
artifactType: uispec
version: 1
status: draft
created: 2026-07-08
updated: 2026-07-08
owner: ARIA Designer

purpose:
  responsibility: Define the approved interface contract for implementation.
  notResponsibleFor:
    - Production frontend code.
    - Backend behavior.
    - Unapproved UX changes.

inputs:
  - path: .aria/orders/design-proposal.md
    role: Approved design intent.
    required: true
  - path: .aria/orders/preview/index.html
    role: Visual alignment reference.
    required: false

outputs:
  - path: .aria/orders/design-package/handoff.md
    role: Coding-agent handoff summary.

consumers:
  - name: Codex
    type: coding-agent
    responsibility: Implement the interface without making new UX decisions.
  - name: Claude Code
    type: coding-agent
    responsibility: Implement the interface without making new UX decisions.

acceptance:
  - rule: Responsive behavior is defined.
    evidence: UISpec responsive section is complete.
    required: true
  - rule: Accessibility expectations are explicit.
    evidence: UISpec accessibility section is complete.
    required: true
  - rule: Design review has passed.
    evidence: Review Findings contain no high-severity open findings.
    required: true

validation:
  manual:
    - Compare UISpec metadata against the approved Design Proposal.
    - Confirm required sections are complete.
    - Confirm acceptance rules have evidence.
```
