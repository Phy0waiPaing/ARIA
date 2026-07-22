import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { formatDoctorReport, runDoctor } from "../src/core/doctor.js";

async function createPackageRoot(): Promise<string> {
  const root = await mkdtemp(path.join(os.tmpdir(), "aria-package-"));
  await writeFile(path.join(root, "package.json"), JSON.stringify({
    name: "aria-orchestrator",
    version: "0.1.0",
    aria: { releaseSource: "github:Phy0waiPaing/ARIA#release" },
  }), "utf8");
  for (const relativePath of [
    "docs/workflows/design-v1.md",
    "schemas/design-proposal-v1.md",
    "schemas/uispec-v1.md",
    "design-system/principles.md",
    "policies/gates.md",
    "policies/visual-review.md",
    "policies/review/default.yaml",
  ]) {
    await mkdir(path.dirname(path.join(root, relativePath)), { recursive: true });
    await writeFile(path.join(root, relativePath), "# test\n", "utf8");
  }
  return root;
}

test("doctor reports an ok target environment", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-doctor-target-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  const packageRoot = await createPackageRoot();
  const report = await runDoctor({
    targetInput: targetRoot,
    packageRoot,
    runtime: { ensureAvailable: async () => {} },
  });

  assert.equal(report.status, "ok");
  assert.equal(report.packageName, "aria-orchestrator");
  assert.equal(report.artifactMode, "trackable");
  assert.equal(report.checks.find((check) => check.name === "codex-runtime")?.status, "pass");
  assert.match(formatDoctorReport(report), /ARIA Doctor: ok/);
});

test("doctor reports missing codex as attention required", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-doctor-target-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  const packageRoot = await createPackageRoot();
  const report = await runDoctor({
    targetInput: targetRoot,
    packageRoot,
    runtime: { ensureAvailable: async () => { throw new Error("Codex missing"); } },
  });

  assert.equal(report.status, "attention_required");
  assert.equal(report.checks.find((check) => check.name === "codex-runtime")?.status, "fail");
});

test("doctor detects ignored aria artifacts", async () => {
  const targetRoot = await mkdtemp(path.join(os.tmpdir(), "aria-doctor-target-"));
  execFileSync("git", ["init"], { cwd: targetRoot, stdio: "ignore" });
  await writeFile(path.join(targetRoot, ".gitignore"), ".aria/\n", "utf8");
  const packageRoot = await createPackageRoot();
  const report = await runDoctor({
    targetInput: targetRoot,
    packageRoot,
    runtime: { ensureAvailable: async () => {} },
  });

  assert.equal(report.artifactMode, "local");
  assert.match(report.checks.find((check) => check.name === "artifact-mode")?.detail ?? "", /ignored/);
});
