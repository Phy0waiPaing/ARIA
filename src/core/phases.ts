import type { FeaturePaths, PhaseDefinition, PhaseId, WorkflowState } from "./types.js";

export const PHASES: readonly PhaseDefinition[] = [
  {
    id: "project-context",
    displayName: "Project Context",
    prerequisites: [],
    allowedOutputs: ["project-context.md"],
    requiredOutputs: ["project-context.md"],
    nextPhase: "design-proposal",
  },
  {
    id: "design-proposal",
    displayName: "Design Proposal",
    prerequisites: ["project-context.md"],
    allowedOutputs: ["design-proposal.md"],
    requiredOutputs: ["design-proposal.md"],
    nextPhase: "html-preview",
  },
  {
    id: "html-preview",
    displayName: "HTML Preview",
    prerequisites: ["design-proposal.md"],
    allowedOutputs: ["preview/index.html", "preview/styles.css", "preview/interactions.js", "preview/assets/**"],
    requiredOutputs: ["preview/index.html", "preview/styles.css"],
    nextPhase: "review",
  },
  {
    id: "review",
    displayName: "Review",
    prerequisites: ["design-proposal.md", "preview/index.html", "preview/styles.css"],
    allowedOutputs: ["review.md"],
    requiredOutputs: ["review.md"],
    nextPhase: "human-approval",
  },
  {
    id: "human-approval",
    displayName: "Human Approval",
    prerequisites: ["review.md"],
    allowedOutputs: ["design-proposal.md"],
    requiredOutputs: [],
    nextPhase: "uispec",
  },
  {
    id: "uispec",
    displayName: "UISpec",
    prerequisites: ["design-proposal.md", "review.md"],
    allowedOutputs: ["target.uispec.md"],
    requiredOutputs: ["target.uispec.md"],
    nextPhase: null,
  },
] as const;

export function getPhase(id: PhaseId): PhaseDefinition {
  const phase = PHASES.find((candidate) => candidate.id === id);
  if (!phase) {
    throw new Error(`Unknown ARIA phase: ${id}`);
  }
  return phase;
}

export function assertPhaseEligible(phaseId: PhaseId, state: WorkflowState, _paths: FeaturePaths): void {
  if (phaseId === "uispec" && state.approvedAt === null) {
    throw new Error("UISpec requires explicit human approval");
  }

  if (phaseId !== state.phase) {
    throw new Error(`Phase ${phaseId} is not eligible while current phase is ${state.phase}`);
  }
}
