import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveArtifactMode, resolveFeaturePaths, resolveTargetRoot } from "../src/core/paths.js";
import { loadOrCreateState } from "../src/core/state.js";

test("rejects path-traversal feature slugs", () => {
  assert.throws(() => resolveFeaturePaths("C:/repo", "../escape"), /feature slug/i);
});

test("resolves a nested working directory to its Git repository root", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-target-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  const nestedDirectory = path.join(targetRoot, "src", "nested");
  await mkdir(nestedDirectory, { recursive: true });

  assert.equal(await resolveTargetRoot(nestedDirectory), await import("node:fs/promises").then(({ realpath }) => realpath(targetRoot)));
});

test("creates only minimal workflow state under the feature folder", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-paths-"));
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  const state = await loadOrCreateState(paths, "local");

  assert.equal(state.phase, "project-context");
  assert.equal(state.status, "ready");
  assert.deepEqual(Object.keys(state).sort(), [
    "answers",
    "approvedAt",
    "artifactMode",
    "feature",
    "phase",
    "status",
    "updatedAt",
    "version",
  ]);
  assert.equal(paths.state, path.join(targetRoot, ".aria", "monitoring-dashboard-v2", "workflow-state.json"));
});

test("updates an existing artifact mode from the target Git ignore rules", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-paths-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  await writeFile(path.join(targetRoot, ".gitignore"), ".aria/\n", "utf8");
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  await loadOrCreateState(paths, "trackable");

  const updated = await loadOrCreateState(paths, await resolveArtifactMode(targetRoot, paths), true);
  assert.equal(updated.artifactMode, "local");
  assert.equal((await loadOrCreateState(paths, "trackable")).artifactMode, "local");
});

test("derives local artifact mode when .aria is ignored", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-paths-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  await writeFile(path.join(targetRoot, ".gitignore"), ".aria/\n", "utf8");
  const paths = resolveFeaturePaths(targetRoot, "monitoring-dashboard-v2");
  await mkdir(paths.root, { recursive: true });

  assert.equal(await resolveArtifactMode(targetRoot, paths), "local");
});
