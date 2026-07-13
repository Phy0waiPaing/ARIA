import { getPhase } from "../core/phases.js";
import type { FeaturePaths, MaterialQuestion, WorkflowState } from "../core/types.js";
import type { ReviewGate } from "../core/runner.js";

function nextAction(state: WorkflowState): string {
  if (state.status === "complete") return "Design package is complete; hand target.uispec.md to a coding agent.";
  if (state.status === "waiting-for-questions" || state.status === "waiting-for-approval") {
    return `aria run --feature ${state.feature}`;
  }
  return `aria run --feature ${state.feature}`;
}

export function renderStatus(
  state: WorkflowState,
  paths: FeaturePaths,
  reviewGate: ReviewGate | undefined,
  questions: MaterialQuestion[],
): string {
  const lines = [
    `Feature: ${state.feature}`,
    `Artifact mode: ${state.artifactMode}`,
    `Current phase: ${getPhase(state.phase).displayName}`,
    `Status: ${state.status}`,
    `Review gate: ${reviewGate ?? "not available"}`,
    "Artifacts:",
    `- ${paths.projectContext}`,
    `- ${paths.proposal}`,
    `- ${paths.preview}`,
    `- ${paths.review}`,
    `- ${paths.targetUispec}`,
  ];

  if (questions.length > 0) {
    lines.push(`Open material questions: ${questions.map((question) => question.id).join(", ")}`);
  }
  lines.push(`Next: ${nextAction(state)}`);
  return lines.join("\n");
}
