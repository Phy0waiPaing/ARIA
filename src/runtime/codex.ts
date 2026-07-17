import { execFile, spawn, type ChildProcess, type SpawnOptionsWithoutStdio } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { buildPhasePrompt } from "../core/prompts.js";
import type { RuntimeAdapter, RuntimePhaseInput, RuntimeResult } from "../core/types.js";

type SpawnImplementation = (
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithoutStdio,
) => ChildProcess;

export interface CodexRuntimeOptions {
  executable?: string;
  packageRoot?: string;
  spawnImpl?: SpawnImplementation;
  model?: string;
  verbose?: boolean;
}

export function findWindowsCodexScript(
  pathValue: string | undefined,
  fileExists: (candidate: string) => boolean = existsSync,
): string | undefined {
  for (const directory of pathValue?.split(path.delimiter) ?? []) {
    if (!directory) continue;
    const candidate = path.join(directory, "node_modules", "@openai", "codex", "bin", "codex.js");
    if (fileExists(candidate)) return candidate;
  }
  return undefined;
}

interface CodexInvocation {
  command: string;
  argsPrefix: readonly string[];
}

export class CodexRuntime implements RuntimeAdapter {
  private readonly executable: string;
  private readonly packageRoot: string;
  private readonly spawnImpl: SpawnImplementation;
  private readonly model: string | undefined;
  private readonly verbose: boolean;
  private resolvedInvocation: CodexInvocation | undefined;

  constructor(options: CodexRuntimeOptions = {}) {
    this.executable = options.executable ?? "codex";
    this.packageRoot = options.packageRoot ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
    this.spawnImpl = options.spawnImpl ?? (spawn as SpawnImplementation);
    this.model = options.model;
    this.verbose = options.verbose ?? process.env.ARIA_VERBOSE === "1";
  }

  async ensureAvailable(): Promise<void> {
    const invocation = this.resolveInvocation();
    await new Promise<void>((resolve, reject) => {
      execFile(invocation.command, [...invocation.argsPrefix, "--version"], { windowsHide: true }, (error) => {
        if (error) {
          reject(new Error(`Codex is unavailable: ${error.message}`));
          return;
        }
        this.resolvedInvocation = invocation;
        resolve();
      });
    });
  }

  async runPhase(input: RuntimePhaseInput): Promise<RuntimeResult> {
    const prompt = buildPhasePrompt({ ...input, packageRoot: this.packageRoot });
    const args = ["exec", "-C", input.targetRoot, "-s", "workspace-write"];
    if (this.model !== undefined) args.push("--model", this.model);
    args.push("-");
    const invocation = this.resolvedInvocation ?? this.resolveInvocation();

    return new Promise<RuntimeResult>((resolve, reject) => {
      const options: SpawnOptionsWithoutStdio = { shell: false, windowsHide: true };
      const child = this.spawnImpl(invocation.command, [...invocation.argsPrefix, ...args], options);
      let stdout = "";
      let stderr = "";

      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on("data", (chunk: string) => {
        stdout += chunk;
        if (this.verbose) process.stdout.write(chunk);
      });
      child.stderr?.on("data", (chunk: string) => {
        stderr += chunk;
        if (this.verbose) process.stderr.write(chunk);
      });
      child.once("error", reject);
      child.once("close", (exitCode) => {
        resolve({ exitCode: exitCode ?? 1, stdout, stderr });
      });
      child.stdin?.end(prompt);
    });
  }

  private resolveInvocation(): CodexInvocation {
    if (process.platform !== "win32" || this.executable !== "codex") {
      return { command: this.executable, argsPrefix: [] };
    }

    const script = findWindowsCodexScript(process.env.PATH);
    return script === undefined
      ? { command: this.executable, argsPrefix: [] }
      : { command: process.execPath, argsPrefix: [script] };
  }
}
