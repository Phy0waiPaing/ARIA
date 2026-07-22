import { appendFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import type { FeaturePaths, PhaseId, RuntimeResult, WorkflowState } from "./types.js";

export type WorkflowEvent =
  | {
    ts: string;
    event: "phase_started";
    phase: PhaseId;
    status: WorkflowState["status"];
  }
  | {
    ts: string;
    event: "phase_completed";
    phase: PhaseId;
    exitCode: number;
    raw: {
      stdout: string;
      stderr: string;
    };
  }
  | {
    ts: string;
    event: "phase_failed";
    phase: PhaseId;
    exitCode: number;
    raw: {
      stdout: string;
      stderr: string;
    };
  }
  | {
    ts: string;
    event: "question_waiting";
    phase: PhaseId;
    questionId: string;
  }
  | {
    ts: string;
    event: "answer_recorded";
    phase: PhaseId;
    questionId: string;
    answerId: string;
  }
  | {
    ts: string;
    event: "revision_requested";
    phase: PhaseId;
    revisionNumber: number;
    limit: number;
    allowExtra: boolean;
  }
  | {
    ts: string;
    event: "preview_waiting";
    phase: PhaseId;
    previewPath: string;
  }
  | {
    ts: string;
    event: "approval_waiting";
    phase: PhaseId;
    gate: string;
  }
  | {
    ts: string;
    event: "approval_recorded";
    phase: PhaseId;
    gate: string;
  }
  | {
    ts: string;
    event: "workflow_completed";
    phase: PhaseId;
    targetUispec: string;
  };

type WorkflowEventInput = WorkflowEvent extends infer Event
  ? Event extends WorkflowEvent
    ? Omit<Event, "ts">
    : never
  : never;

function compactTimestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

function rawFilePrefix(phase: PhaseId): string {
  return `${compactTimestamp()}-${phase}`;
}

function toPosix(relativePath: string): string {
  return relativePath.split(path.sep).join("/");
}

export async function appendWorkflowEvent(paths: FeaturePaths, event: WorkflowEventInput): Promise<void> {
  await mkdir(paths.root, { recursive: true });
  await appendFile(paths.events, `${JSON.stringify({ ts: new Date().toISOString(), ...event })}\n`, "utf8");
}

export async function writeRawPhaseLogs(
  paths: FeaturePaths,
  phase: PhaseId,
  result: RuntimeResult,
): Promise<{ stdout: string; stderr: string }> {
  await mkdir(paths.raw, { recursive: true });
  const prefix = rawFilePrefix(phase);
  const stdoutPath = path.join(paths.raw, `${prefix}.stdout.log`);
  const stderrPath = path.join(paths.raw, `${prefix}.stderr.log`);

  await writeFile(stdoutPath, result.stdout, "utf8");
  await writeFile(stderrPath, result.stderr, "utf8");

  return {
    stdout: toPosix(path.relative(paths.root, stdoutPath)),
    stderr: toPosix(path.relative(paths.root, stderrPath)),
  };
}
