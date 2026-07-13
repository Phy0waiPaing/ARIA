import path from "node:path";

import type { FeaturePaths } from "./types.js";

const FEATURE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function resolveFeaturePaths(targetRoot: string, feature: string): FeaturePaths {
  if (!FEATURE_SLUG.test(feature)) {
    throw new Error("Feature slug must use lowercase kebab-case without path separators");
  }

  const root = path.resolve(targetRoot, ".aria", feature);
  const ariaRoot = path.resolve(targetRoot, ".aria");

  if (!root.startsWith(`${ariaRoot}${path.sep}`)) {
    throw new Error("Feature slug must resolve inside .aria");
  }

  return {
    feature,
    root,
    state: path.join(root, "workflow-state.json"),
    projectContext: path.join(root, "project-context.md"),
    proposal: path.join(root, "design-proposal.md"),
    preview: path.join(root, "preview"),
    review: path.join(root, "review.md"),
    currentUispec: path.join(root, "current.uispec.md"),
    targetUispec: path.join(root, "target.uispec.md"),
  };
}
