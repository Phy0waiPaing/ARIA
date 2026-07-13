import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { getPhase } from "../src/core/phases.js";
import { resolveFeaturePaths } from "../src/core/paths.js";
import { assertScopeIntegrity, captureSnapshot } from "../src/core/scope-integrity.js";
import type { WorkspaceSnapshot } from "../src/core/types.js";

const paths = resolveFeaturePaths("C:/repo", "monitoring-dashboard-v2");

function snapshot(files: Record<string, string>): WorkspaceSnapshot {
  return { git: new Map(), files: new Map(Object.entries(files)) };
}

test("accepts a new phase artifact under the allowed feature path", () => {
  const before = snapshot({ "src/page.tsx": "before" });
  const after = snapshot({
    "src/page.tsx": "before",
    ".aria/monitoring-dashboard-v2/project-context.md": "new-content",
  });

  const result = assertScopeIntegrity(before, after, getPhase("project-context"), paths);
  assert.deepEqual(result.unexpectedPaths, []);
});

test("blocks a source change made during project-context", () => {
  const before = snapshot({ "src/page.tsx": "before" });
  const after = snapshot({ "src/page.tsx": "after" });

  const result = assertScopeIntegrity(before, after, getPhase("project-context"), paths);
  assert.deepEqual(result.unexpectedPaths, ["src/page.tsx"]);
});

test("does not flag a dirty file that existed before the phase", () => {
  const before = snapshot({ "src/page.tsx": "already-dirty" });
  const after = snapshot({ "src/page.tsx": "already-dirty" });

  const result = assertScopeIntegrity(before, after, getPhase("project-context"), paths);
  assert.deepEqual(result.unexpectedPaths, []);
});

test("allows an ignored local artifact using the filesystem snapshot", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-scope-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  await writeFile(path.join(targetRoot, ".gitignore"), ".aria/\n", "utf8");
  const featurePaths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  const before = await captureSnapshot(targetRoot);
  await mkdir(featurePaths.root, { recursive: true });
  await writeFile(featurePaths.projectContext, "# Context\n", { encoding: "utf8", flag: "w" });
  const after = await captureSnapshot(targetRoot);

  const result = assertScopeIntegrity(before, after, getPhase("project-context"), featurePaths);
  assert.deepEqual(result.unexpectedPaths, []);
});
