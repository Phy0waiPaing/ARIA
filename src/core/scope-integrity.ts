import { execFile } from "node:child_process";
import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import type { FeaturePaths, PhaseDefinition, ScopeIntegrityResult, WorkspaceSnapshot } from "./types.js";

const execFileAsync = promisify(execFile);

function normalize(relativePath: string): string {
  return relativePath.replaceAll("\\", "/");
}

async function captureFiles(root: string, current = root, files = new Map<string, string>()): Promise<Map<string, string>> {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;

    const absolutePath = path.join(current, entry.name);
    if (entry.isDirectory()) {
      await captureFiles(root, absolutePath, files);
      continue;
    }
    if (!entry.isFile()) continue;

    const content = await readFile(absolutePath);
    const relativePath = normalize(path.relative(root, absolutePath));
    files.set(relativePath, createHash("sha256").update(content).digest("hex"));
  }
  return files;
}

function parseGitStatus(output: string): Map<string, string> {
  const statuses = new Map<string, string>();
  for (const line of output.split(/\r?\n/)) {
    if (!line) continue;
    const status = line.slice(0, 2);
    const relativePath = normalize(line.slice(3));
    // Git collapses untracked and ignored directories (for example `.aria/`) into
    // one porcelain entry. The filesystem snapshot below carries the file-level
    // evidence needed for phase scope checks.
    if (relativePath && !relativePath.endsWith("/")) statuses.set(relativePath, status);
  }
  return statuses;
}

export async function captureSnapshot(targetRoot: string): Promise<WorkspaceSnapshot> {
  const [{ stdout }, files] = await Promise.all([
    execFileAsync("git", ["status", "--porcelain=v1", "--ignored"], { cwd: targetRoot, windowsHide: true }),
    captureFiles(targetRoot),
  ]);

  return { git: parseGitStatus(stdout), files };
}

function hasChanged(before: WorkspaceSnapshot, after: WorkspaceSnapshot, relativePath: string): boolean {
  return before.files.get(relativePath) !== after.files.get(relativePath)
    || before.git.get(relativePath) !== after.git.get(relativePath);
}

function isAllowed(relativePath: string, phase: PhaseDefinition, paths: FeaturePaths): boolean {
  const prefix = `.aria/${paths.feature}/`;
  if (!relativePath.startsWith(prefix)) return false;

  const featureRelativePath = relativePath.slice(prefix.length);
  return phase.allowedOutputs.some((allowedOutput) => {
    if (allowedOutput.endsWith("/**")) {
      return featureRelativePath.startsWith(allowedOutput.slice(0, -2));
    }
    return featureRelativePath === allowedOutput;
  });
}

export function assertScopeIntegrity(
  before: WorkspaceSnapshot,
  after: WorkspaceSnapshot,
  phase: PhaseDefinition,
  paths: FeaturePaths,
): ScopeIntegrityResult {
  const candidatePaths = new Set([...before.files.keys(), ...after.files.keys(), ...before.git.keys(), ...after.git.keys()]);
  const changedPaths = [...candidatePaths].filter((relativePath) => hasChanged(before, after, relativePath)).sort();
  const unexpectedPaths = changedPaths.filter((relativePath) => !isAllowed(relativePath, phase, paths));

  return { changedPaths, unexpectedPaths };
}
