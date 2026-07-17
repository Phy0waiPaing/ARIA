import path from "node:path";

import type { RuntimePhaseInput } from "./types.js";

export interface PhasePromptInput extends RuntimePhaseInput {
  packageRoot: string;
}

function phaseExecutionNotes(input: PhasePromptInput): string[] {
  const featureRoot = `.aria/${input.feature}`;

  switch (input.phase.id) {
    case "project-context":
      return [
        "Project-context requirements:",
        "- For existing-project UI work, capture concrete visual evidence, not only file names.",
        "- Include a `## Visual Contract` section in project-context.md for existing-project UI work.",
        "- In `## Visual Contract`, record: shell, navigation, page container, typography, colors/tokens, spacing, borders, radius, shadows, density, icons, buttons, tables, forms, dialogs, state treatments, and explicit do-not-invent rules.",
        "- Record the app shell, navigation, page container, spacing, typography, colors, borders, radius, shadows, icon usage, and density that the preview must preserve.",
        "- Record reusable component names and their visible signatures, including nearby page patterns, button variants, table patterns, dialogs, form fields, empty/error/loading states, and action placement.",
        "- Cite source files for every visual convention that will constrain the Design Proposal or HTML Preview.",
      ];
    case "html-preview":
      return [
        "HTML-preview requirements:",
        `- Read ${featureRoot}/design-proposal.md and ${featureRoot}/project-context.md before rendering the preview.`,
        "- Use the project context `## Visual Contract` as the preview's visual source contract.",
        "- Re-open the project-context evidence source files that define the current app shell, components, tokens, and nearby page patterns.",
        "- Render the preview as a visual fit for the target app, not as a generic standalone mockup.",
        "- Reuse the target app's visual language: shell structure, navigation style, page padding, typography scale, colors, borders, radius, shadows, density, icon treatment, table pattern, dialog pattern, form controls, and state styling.",
        "- Do not invent a new sidebar, header, accent color, card treatment, decorative section, or component primitive unless the Design Proposal explicitly approves that visual change.",
        "- If exact framework classes cannot be used in static HTML, translate the target project's tokens and component signatures into local CSS variables and plain CSS that visually match them.",
        "- Keep review-only state samples compact and visually subordinate so they do not become a second page design.",
      ];
    case "review":
      return [
        "Review requirements:",
        "- Compare the preview against project-context evidence and referenced source files, not only against the proposal prose.",
        "- For existing-project UI work, verify the preview against the project context `## Visual Contract` item by item.",
        "- Record browser/render evidence for desktop and mobile, and tablet when the interface is dense, table-based, layout-heavy, or navigation-heavy.",
        "- Record whether the preview has console errors, horizontal overflow, unusable mobile layout, unreadable text, or inert approval-critical interactions.",
        "- Treat invented shell structure, invented color tokens, invented component primitives, or decorative sections that conflict with the target app as design-system failures.",
      ];
    default:
      return [];
  }
}

export function buildPhasePrompt(input: PhasePromptInput): string {
  const featureRoot = `.aria/${input.feature}`;
  const allowedOutputs = input.phase.allowedOutputs.map((output) => `- ${featureRoot}/${output}`).join("\n") || "- None";
  const answers = Object.entries(input.answers)
    .map(([id, choice]) => `- ${id}: ${choice}`)
    .join("\n") || "- None";
  const executionNotes = phaseExecutionNotes(input).join("\n") || "- No additional phase-specific notes.";

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
    `- ${path.join(input.packageRoot, "policies", "gates.md")}`,
    `- ${path.join(input.packageRoot, "policies", "visual-review.md")}`,
    `- ${path.join(input.packageRoot, "policies", "review", "default.yaml")}`,
    "",
    "Phase-specific execution notes:",
    executionNotes,
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
    "- When artifact mode is local, record that ARIA automatically selected local-only storage because the feature artifact folder is ignored by Git.",
    "- Finish this phase, report the artifact paths created or updated, and stop.",
  ].join("\n");
}
