# ARIA

**AI Requirements & Interface Architect**

ARIA is an AI design partner that turns business requirements into implementation-ready design decisions.

ARIA is not a code generator. It helps teams decide what should be built before Codex decides how to build it.

Start with [manifest.md](manifest.md). It is the conceptual source for ARIA v0.1.

For the v1 direction, see [docs/ROADMAP.md](docs/ROADMAP.md). The roadmap describes ARIA's evolution toward an AI Design Orchestrator. This repository now includes the small Codex-backed v0 orchestrator that proves the documented design workflow.

## v0.1 Focus

v0.1 establishes a docs-first methodology and a deliberately narrow local CLI.

Included:

- Project manifest and responsibility boundaries.
- Requirement-to-Design-Proposal workflow.
- Existing-page refactor workflow.
- New-page-in-existing-project workflow with project context capture.
- Manual phase-gated design workflow for ARIA-alone spike testing.
- Visual Review workflow with HTML Preview as the default renderer for visual UI work.
- Human-facing Design Proposal contract.
- UISpec v1 implementation contract.
- Future Design Package schema stub.
- Future Work Contract schema stub.
- Role prompts for analysis, design, review, and export.
- Design principles, component guidance, and pattern guidance.
- Accessibility, gate, visual review, review, and artifact governance policies.
- Feature-centric target-project artifacts under `.aria/[feature-name]/`.
- A Codex-backed CLI that runs the six design phases, captures minimal resumable state, asks material questions interactively, pauses for preview review, and pauses for human approval.

Not included yet:

- Production frontend code generation.
- Visual validation automation.
- Design Package automation.
- Work Contract enforcement.
- Official examples.

## Core Workflow

```text
Business Requirement
  -> Discovery
  -> Design Proposal
  -> HTML Preview
  -> Review
  -> Human Approval
  -> UISpec
  -> Codex
```

## Run The Orchestrator

ARIA runs from the target repository. The current directory is the target by default.

```powershell
npm install -g --install-links=true github:Phy0waiPaing/ARIA#release

cd <target-project>
aria run --feature monitoring-dashboard-v2
```

The GitHub install runs ARIA's package build during installation, so the `aria`
command is ready without cloning, building, or linking the repository manually.
`--install-links=true` avoids npm creating a temporary Git-cache junction during
global installation on Windows.

ARIA automatically keeps artifacts local when the target project's `.aria/`
directory is ignored by Git; otherwise, artifacts remain trackable.

The feature slug is only the artifact name. Use `--brief` on the first run when the business intent is more specific than the slug:

```powershell
aria run --feature role-crud-v2 --brief "Role create should collect only a name for now. Permissions will be added later."
```

The runner advances automatically through Project Context, Design Proposal, and HTML Preview. It presents numbered material-question choices in the terminal, then pauses so the human can inspect the rendered preview before Review. A later run continues through Review and pauses again at Human Approval with a default-no `[y/N]` prompt before compiling the UISpec. Production implementation remains outside ARIA v0.

If the preview is wrong, do not edit the preview manually. Record design feedback and let ARIA return to Design Proposal, re-render HTML Preview, and pause again:

```powershell
aria revise --feature role-crud-v2 --message "The create role flow should only ask for a role name. Remove permission assignment from this version and match the existing SVMP admin page density."
```

Useful commands:

```powershell
aria status --feature monitoring-dashboard-v2
aria run --feature monitoring-dashboard-v2 --phase review
aria run --feature monitoring-dashboard-v2 --target <target-project>
aria run --feature monitoring-dashboard-v2 --model gpt-5
aria run --feature monitoring-dashboard-v2 --verbose
aria revise --feature monitoring-dashboard-v2 --message "Use the existing table toolbar pattern."
aria upgrade
aria uninstall
```

`--phase` is an advanced retry/testing control: it runs only the current eligible phase and never bypasses a gate.
`--brief` is initial business intent, not a replacement for the feature slug. `aria revise --message` is for human feedback after a proposal, preview, or review needs changes.
ARIA hides raw Codex phase output during normal runs so the terminal shows only workflow status, running phase progress, questions, gates, and final artifact paths. Use `--model` or `ARIA_MODEL` to select the Codex model for phase execution. When no model is set, ARIA uses the Codex config default. Use `--verbose` or set `ARIA_VERBOSE=1` when you need the underlying Codex transcript for diagnostics.

`aria upgrade` reinstalls the CLI from the public `release` branch. `aria uninstall`
asks for confirmation, then removes only ARIA's global npm package.

## Release Channel

`main` remains the development branch. The public installation source is the
`release` branch, so users do not receive work-in-progress changes from `main`.

After testing the desired `main` commit, promote it deliberately:

```powershell
git switch release
git merge main
git push origin release
git switch main
```

This promotion is intentionally manual. ARIA never updates or publishes the
release branch by itself.

## Proven Spike

The manual ARIA-alone workflow was validated against a real target-project Role CRUD page.

Result:

- ARIA produced Project Context, Design Proposal, HTML Preview, approved UISpec, and a persisted downstream implementation-review artifact.
- Codex implemented from the approved UISpec as a separate phase.
- The spike's historical implementation review informed the current review-policy design.
- The review artifact recorded `PASS_WITH_NOTES`, with no blocking design-fidelity issues.
- Notes were verification-scope limits, not design blockers.

## Responsibility Split

ARIA:

- Owns product and UX decisions.
- Produces Design Proposals and UISpecs.
- Reviews Design Proposals and HTML Previews against explicit UI and UX criteria before human approval.
- Does not generate production frontend code.

Codex:

- Renders ARIA's HTML Preview artifact for visual UI work.
- Builds production frontend.
- Follows the approved UISpec.
- Does not redesign UX without explicit instruction.

## Repository Structure

```text
ARIA/
  manifest.md
  README.md
  package.json
  src/
    bin.ts
    cli/
    core/
    runtime/
  test/
  workflow.md
  visual-review-workflow.md
  docs/
    ROADMAP.md
    architecture.md
    project-structure.md
    workflows/
      design-v1.md
  prompts/
    analyst.md
    designer.md
    reviewer.md
    exporter.md
  schemas/
    design-proposal-v1.md
    uispec-v1.md
    work-contract-v1.md
    design-package-v1.md
  design-system/
    principles.md
    components.md
    patterns.md
  policies/
    accessibility.md
    gates.md
    review/
      default.yaml
    visual-review.md
    artifact-governance.md
```

## Document Map

- `manifest.md` defines what ARIA is and where responsibility boundaries sit.
- `docs/ROADMAP.md` defines the v1 direction and future phases.
- `docs/architecture.md` defines ARIA's conceptual layers.
- `docs/project-structure.md` defines ARIA-owned files and target-project artifact locations.
- `src/` contains the v0 CLI runner, phase catalog, scope checker, and Codex runtime adapter.
- `docs/workflows/design-v1.md` defines the manual phase-gated workflow for proving ARIA without hidden chat context.
- `workflow.md` defines the operational lifecycle.
- `visual-review-workflow.md` defines the visual review layer.
- `schemas/design-proposal-v1.md` defines the human-facing design artifact.
- `schemas/uispec-v1.md` defines the Codex implementation contract.
- `prompts/analyst.md` guides requirement discovery and clarification.
- `prompts/designer.md` guides UX design and UISpec compilation.
- `prompts/reviewer.md` guides proposal-plus-preview design review before human approval.
- `design-system/principles.md` defines ARIA's design principles.
- `design-system/components.md` defines framework-agnostic component guidance.
- `design-system/patterns.md` defines reusable UX pattern guidance.
- `policies/accessibility.md` defines baseline accessibility expectations.
- `policies/gates.md` defines phase gates, blocking failures, and allowed next actions.
- `policies/review/default.yaml` defines ARIA's default review criteria, blocking issues, and gate result model.
- `policies/visual-review.md` defines visual review rules.
- `policies/artifact-governance.md` defines artifact ownership, consumer, and acceptance rules.
- `prompts/exporter.md`, `schemas/work-contract-v1.md`, and `schemas/design-package-v1.md` are future handoff/governance assets, not active v0 runtime authority.
