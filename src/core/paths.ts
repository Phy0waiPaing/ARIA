import { execFile } from "node:child_process";
import { realpath } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import type { ArtifactMode, FeaturePaths } from "./types.js";

const FEATURE_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const execFileAsync = promisify(execFile);

export async function resolveTargetRoot(input = process.cwd()): Promise<string> {
  const requested = await realpath(input);
  try {
    const { stdout } = await execFileAsync("git", ["rev-parse", "--show-toplevel"], {
      cwd: requested,
      windowsHide: true,
    });
    return realpath(stdout.trim());
  } catch {
    throw new Error(`ARIA target must be inside a Git repository: ${requested}`);
  }
}

export async function resolveArtifactMode(targetRoot: string, paths: FeaturePaths): Promise<ArtifactMode> {
  const featureRelativePath = path.relative(targetRoot, paths.root);
  try {
    await execFileAsync("git", ["check-ignore", "-q", "--", featureRelativePath], {
      cwd: targetRoot,
      windowsHide: true,
    });
    return "local";
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === 1) return "trackable";
    throw error;
  }
}

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
    events: path.join(root, "events.jsonl"),
    raw: path.join(root, "raw"),
    usage: path.join(root, "usage.json"),
    projectContext: path.join(root, "project-context.md"),
    proposal: path.join(root, "design-proposal.md"),
    preview: path.join(root, "preview"),
    review: path.join(root, "review.md"),
    currentUispec: path.join(root, "current.uispec.md"),
    targetUispec: path.join(root, "target.uispec.md"),
  };
}
