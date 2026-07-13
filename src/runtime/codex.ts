import { execFile, spawn, type ChildProcess, type SpawnOptionsWithoutStdio } from "node:child_process";
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
}

export class CodexRuntime implements RuntimeAdapter {
  private readonly executable: string;
  private readonly packageRoot: string;
  private readonly spawnImpl: SpawnImplementation;

  constructor(options: CodexRuntimeOptions = {}) {
    this.executable = options.executable ?? "codex";
    this.packageRoot = options.packageRoot ?? path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../..");
    this.spawnImpl = options.spawnImpl ?? (spawn as SpawnImplementation);
  }

  async ensureAvailable(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      execFile(this.executable, ["--version"], { windowsHide: true }, (error) => {
        if (error) {
          reject(new Error(`Codex is unavailable: ${error.message}`));
          return;
        }
        resolve();
      });
    });
  }

  async runPhase(input: RuntimePhaseInput): Promise<RuntimeResult> {
    const prompt = buildPhasePrompt({ ...input, packageRoot: this.packageRoot });
    const args = ["exec", "-C", input.targetRoot, "-s", "workspace-write", "-"];

    return new Promise<RuntimeResult>((resolve, reject) => {
      const options: SpawnOptionsWithoutStdio = { shell: false, windowsHide: true };
      const child = this.spawnImpl(this.executable, args, options);
      let stdout = "";
      let stderr = "";

      child.stdout?.setEncoding("utf8");
      child.stderr?.setEncoding("utf8");
      child.stdout?.on("data", (chunk: string) => {
        stdout += chunk;
        process.stdout.write(chunk);
      });
      child.stderr?.on("data", (chunk: string) => {
        stderr += chunk;
        process.stderr.write(chunk);
      });
      child.once("error", reject);
      child.once("close", (exitCode) => {
        resolve({ exitCode: exitCode ?? 1, stdout, stderr });
      });
      child.stdin?.end(prompt);
    });
  }
}
