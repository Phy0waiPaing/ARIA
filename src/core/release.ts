import { spawn, type ChildProcess, type SpawnOptionsWithoutStdio } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface ReleaseConfig {
  packageName: string;
  releaseSource: string;
}

export interface NpmResult {
  exitCode: number;
  stdout: string;
  stderr: string;
}

type SpawnImplementation = (
  command: string,
  args: readonly string[],
  options: SpawnOptionsWithoutStdio,
) => ChildProcess;

export interface ReleaseManagerOptions {
  config?: ReleaseConfig;
  packageJsonPath?: string;
  spawnImpl?: SpawnImplementation;
}

function defaultPackageJsonPath(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../package.json");
}

export async function loadReleaseConfig(packageJsonPath = defaultPackageJsonPath()): Promise<ReleaseConfig> {
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8")) as {
    name?: unknown;
    aria?: { releaseSource?: unknown };
  };

  if (typeof packageJson.name !== "string" || typeof packageJson.aria?.releaseSource !== "string") {
    throw new Error("ARIA package metadata must define name and aria.releaseSource");
  }

  return {
    packageName: packageJson.name,
    releaseSource: packageJson.aria.releaseSource,
  };
}

export class ReleaseManager {
  private readonly configInput: ReleaseConfig | undefined;
  private readonly packageJsonPath: string | undefined;
  private readonly spawnImpl: SpawnImplementation;

  constructor(options: ReleaseManagerOptions = {}) {
    this.configInput = options.config;
    this.packageJsonPath = options.packageJsonPath;
    this.spawnImpl = options.spawnImpl ?? (spawn as SpawnImplementation);
  }

  async upgrade(): Promise<NpmResult> {
    const config = await this.config();
    return this.runNpm(["install", "-g", "--install-links=true", config.releaseSource]);
  }

  async uninstall(): Promise<NpmResult> {
    const config = await this.config();
    return this.runNpm(["uninstall", "-g", config.packageName]);
  }

  private async config(): Promise<ReleaseConfig> {
    return this.configInput ?? loadReleaseConfig(this.packageJsonPath);
  }

  private runNpm(args: readonly string[]): Promise<NpmResult> {
    const executable = process.platform === "win32" ? "npm.cmd" : "npm";

    return new Promise<NpmResult>((resolve, reject) => {
      const child = this.spawnImpl(executable, args, { shell: false, windowsHide: true });
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
      child.once("close", (exitCode) => resolve({ exitCode: exitCode ?? 1, stdout, stderr }));
    });
  }
}
