import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FeaturePaths, PhaseId } from "./types.js";

export interface UsageUnavailable {
  status: "unavailable";
  input_tokens: null;
  cached_input_tokens: null;
  output_tokens: null;
  reasoning_output_tokens: null;
  total_tokens: null;
}

export interface PhaseInvocationUsage {
  id: string;
  phase: PhaseId;
  model: string;
  started_at: string;
  completed_at: string;
  duration_ms: number;
  exit_code: number;
  raw: {
    stdout: string;
    stderr: string;
  };
  usage: UsageUnavailable;
}

export interface FeatureUsage {
  schema_version: 1;
  feature: string;
  scope: "aria-feature";
  coverage: "unavailable";
  status: "partial" | "complete";
  started_at: string;
  updated_at: string;
  duration_ms: number;
  invocations: PhaseInvocationUsage[];
  usage: UsageUnavailable;
}

export interface RecordPhaseUsageInput {
  phase: PhaseId;
  model: string;
  startedAt: string;
  completedAt: string;
  durationMs: number;
  exitCode: number;
  raw: {
    stdout: string;
    stderr: string;
  };
  complete: boolean;
}

function unavailableUsage(): UsageUnavailable {
  return {
    status: "unavailable",
    input_tokens: null,
    cached_input_tokens: null,
    output_tokens: null,
    reasoning_output_tokens: null,
    total_tokens: null,
  };
}

async function readFeatureUsage(paths: FeaturePaths): Promise<FeatureUsage | null> {
  try {
    return JSON.parse(await readFile(paths.usage, "utf8")) as FeatureUsage;
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") return null;
    throw error;
  }
}

export async function recordPhaseUsage(paths: FeaturePaths, input: RecordPhaseUsageInput): Promise<FeatureUsage> {
  const previous = await readFeatureUsage(paths);
  const invocation: PhaseInvocationUsage = {
    id: `${input.startedAt.replace(/[-:.]/g, "").replace(/Z$/, "Z")}-${input.phase}`,
    phase: input.phase,
    model: input.model,
    started_at: input.startedAt,
    completed_at: input.completedAt,
    duration_ms: input.durationMs,
    exit_code: input.exitCode,
    raw: input.raw,
    usage: unavailableUsage(),
  };
  const invocations = [...(previous?.invocations ?? []), invocation];
  const usage: FeatureUsage = {
    schema_version: 1,
    feature: paths.feature,
    scope: "aria-feature",
    coverage: "unavailable",
    status: input.complete ? "complete" : "partial",
    started_at: previous?.started_at ?? invocation.started_at,
    updated_at: invocation.completed_at,
    duration_ms: invocations.reduce((sum, item) => sum + item.duration_ms, 0),
    invocations,
    usage: unavailableUsage(),
  };

  await mkdir(path.dirname(paths.usage), { recursive: true });
  const temporary = `${paths.usage}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(usage, null, 2)}\n`, "utf8");
  await rename(temporary, paths.usage);
  return usage;
}
