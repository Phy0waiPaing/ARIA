import path from "node:path";

import type { RuntimePhaseInput } from "./types.js";

export interface PhasePromptInput extends RuntimePhaseInput {
  packageRoot: string;
}

export function buildPhasePrompt(input: PhasePromptInput): string {
  const featureRoot = `.aria/${input.feature}`;
  const allowedOutputs = input.phase.allowedOutputs.map((output) => `- ${featureRoot}/${output}`).join("\n") || "- None";
  const answers = Object.entries(input.answers)
    .map(([id, choice]) => `- ${id}: ${choice}`)
    .join("\n") || "- None";

  return [
    "You are the Codex runtime for one bounded ARIA workflow phase.",
    "",
    `Feature: ${input.feature}`,
    `Phase: ${input.phase.displayName} (${input.phase.id})`,
    `Target repository: ${input.targetRoot}`,
    `Artifact mode: ${input.artifactMode}`,
    "",
    "ARIA workflow authority:",
    `- ${path.join(input.packageRoot, "docs", "workflows", "design-v1.md")}`,
    `- ${path.join(input.packageRoot, "schemas", "design-proposal-v1.md")}`,
    `- ${path.join(input.packageRoot, "design-system", "principles.md")}`,
    `- ${path.join(input.packageRoot, "design-system", "components.md")}`,
    `- ${path.join(input.packageRoot, "design-system", "patterns.md")}`,
    `- ${path.join(input.packageRoot, "policies", "review", "default.yaml")}`,
    "",
    "Selected material-question answers:",
    answers,
    "",
    "Allowed outputs for this phase:",
    allowedOutputs,
    "",
    "Rules:",
    "- Read the ARIA workflow authority before acting.",
    "- Work only in the target repository and only on the named feature artifact path.",
    "- Do not create artifacts from later phases.",
    "- Do not create or edit production application code.",
    "- Do not alter files outside the allowed outputs.",
    "- When artifact mode is local, record the explicit local-only decision in the phase artifact when applicable.",
    "- Finish this phase, report the artifact paths created or updated, and stop.",
  ].join("\n");
}
