import { constants } from "node:fs";
import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { loadReleaseConfig } from "./release.js";
import { resolveTargetRoot } from "./paths.js";
import type { RuntimeAdapter } from "./types.js";

export type DoctorStatus = "ok" | "attention_required";
export type DoctorCheckStatus = "pass" | "warn" | "fail";

export interface DoctorCheck {
  name: string;
  status: DoctorCheckStatus;
  detail: string;
}

export interface DoctorReport {
  status: DoctorStatus;
  packageName: string;
  packageVersion: string;
  releaseSource: string;
  targetInput: string;
  targetRoot: string | null;
  artifactMode: "trackable" | "local" | "unknown";
  checks: DoctorCheck[];
}

export interface DoctorOptions {
  targetInput?: string;
  packageRoot: string;
  runtime: Pick<RuntimeAdapter, "ensureAvailable">;
  execFile?: typeof import("node:child_process").execFile;
}

async function readPackageMetadata(packageRoot: string): Promise<{ name: string; version: string }> {
  const metadata = JSON.parse(await readFile(path.join(packageRoot, "package.json"), "utf8")) as {
    name?: unknown;
    version?: unknown;
  };
  return {
    name: typeof metadata.name === "string" ? metadata.name : "unknown",
    version: typeof metadata.version === "string" ? metadata.version : "unknown",
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function isWritable(directory: string): Promise<boolean> {
  try {
    await access(directory, constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

async function isAriaIgnored(targetRoot: string, execFileImpl: NonNullable<DoctorOptions["execFile"]>): Promise<boolean | null> {
  return await new Promise<boolean | null>((resolve, reject) => {
    execFileImpl("git", ["check-ignore", "-q", "--", ".aria/doctor-probe"], { cwd: targetRoot, windowsHide: true }, (error) => {
      if (!error) {
        resolve(true);
        return;
      }
      if ("code" in error && error.code === 1) {
        resolve(false);
        return;
      }
      reject(error);
    });
  });
}

export async function runDoctor(options: DoctorOptions): Promise<DoctorReport> {
  const targetInput = options.targetInput ?? process.cwd();
  const execFileImpl = options.execFile ?? (await import("node:child_process")).execFile;
  const packageMetadata = await readPackageMetadata(options.packageRoot);
  const releaseConfig = await loadReleaseConfig(path.join(options.packageRoot, "package.json"));
  const checks: DoctorCheck[] = [];
  let targetRoot: string | null = null;
  let artifactMode: DoctorReport["artifactMode"] = "unknown";

  checks.push({
    name: "package",
    status: "pass",
    detail: `${packageMetadata.name} ${packageMetadata.version}`,
  });

  checks.push({
    name: "release-source",
    status: "pass",
    detail: releaseConfig.releaseSource,
  });

  try {
    targetRoot = await resolveTargetRoot(targetInput);
    checks.push({ name: "target-git-root", status: "pass", detail: targetRoot });
  } catch (error) {
    checks.push({
      name: "target-git-root",
      status: "fail",
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  if (targetRoot !== null) {
    checks.push({
      name: "target-write-access",
      status: await isWritable(targetRoot) ? "pass" : "fail",
      detail: targetRoot,
    });

    try {
      const ignored = await isAriaIgnored(targetRoot, execFileImpl);
      artifactMode = ignored === true ? "local" : ignored === false ? "trackable" : "unknown";
      checks.push({
        name: "artifact-mode",
        status: "pass",
        detail: artifactMode === "local" ? ".aria is ignored; artifacts stay local" : ".aria is trackable",
      });
    } catch (error) {
      checks.push({
        name: "artifact-mode",
        status: "warn",
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  const authorityFiles = [
    "docs/workflows/design-v1.md",
    "schemas/design-proposal-v1.md",
    "schemas/uispec-v1.md",
    "design-system/principles.md",
    "policies/gates.md",
    "policies/visual-review.md",
    "policies/review/default.yaml",
  ];
  const missingAuthority = [];
  for (const relativePath of authorityFiles) {
    if (!await exists(path.join(options.packageRoot, relativePath))) missingAuthority.push(relativePath);
  }
  checks.push({
    name: "workflow-authority",
    status: missingAuthority.length === 0 ? "pass" : "fail",
    detail: missingAuthority.length === 0 ? `${authorityFiles.length} file(s) present` : `Missing: ${missingAuthority.join(", ")}`,
  });

  try {
    await options.runtime.ensureAvailable();
    checks.push({ name: "codex-runtime", status: "pass", detail: "Codex command is available" });
  } catch (error) {
    checks.push({
      name: "codex-runtime",
      status: "fail",
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return {
    status: checks.some((check) => check.status === "fail") ? "attention_required" : "ok",
    packageName: packageMetadata.name,
    packageVersion: packageMetadata.version,
    releaseSource: releaseConfig.releaseSource,
    targetInput,
    targetRoot,
    artifactMode,
    checks,
  };
}

export function formatDoctorReport(report: DoctorReport): string {
  const lines = [
    `ARIA Doctor: ${report.status}`,
    `Package:     ${report.packageName} ${report.packageVersion}`,
    `Release:     ${report.releaseSource}`,
    `Target:      ${report.targetRoot ?? report.targetInput}`,
    `Artifacts:   ${report.artifactMode}`,
    "",
    "Checks:",
  ];

  for (const check of report.checks) {
    lines.push(`  ${check.status.padEnd(4)} ${check.name.padEnd(22)} ${check.detail}`);
  }

  return lines.join("\n");
}
