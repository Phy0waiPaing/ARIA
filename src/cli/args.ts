export type ArtifactMode = "trackable" | "local";

export interface ParsedCommand {
  command: "run" | "status";
  feature: string;
  target: string;
  phase: string | undefined;
  artifactMode: ArtifactMode;
}

export class CliUsageError extends Error {}

export function formatUsage(): string {
  return [
    "Usage:",
    "  aria run --feature <slug> [--phase <phase>] [--target <path>] [--artifact-mode trackable|local]",
    "  aria status --feature <slug> [--target <path>]",
  ].join("\n");
}

export function parseArgs(argv: string[]): ParsedCommand {
  const [command, ...rest] = argv;

  if (command !== "run" && command !== "status") {
    throw new CliUsageError(`Unknown command: ${command ?? ""}`.trim());
  }

  let feature: string | undefined;
  let target = process.cwd();
  let phase: string | undefined;
  let artifactMode: ArtifactMode = "trackable";
  let targetProvided = false;
  let artifactModeProvided = false;

  for (let index = 0; index < rest.length; index += 1) {
    const option = rest[index];
    const value = rest[index + 1];

    if (!option?.startsWith("--")) {
      throw new CliUsageError(`Unexpected argument: ${option ?? ""}`.trim());
    }

    if (value === undefined || value.startsWith("--")) {
      throw new CliUsageError(`Missing value for ${option}`);
    }

    switch (option) {
      case "--feature":
        if (feature !== undefined) throw new CliUsageError("--feature may be provided once");
        feature = value;
        break;
      case "--target":
        if (targetProvided) throw new CliUsageError("--target may be provided once");
        target = value;
        targetProvided = true;
        break;
      case "--phase":
        if (phase !== undefined) throw new CliUsageError("--phase may be provided once");
        phase = value;
        break;
      case "--artifact-mode":
        if (artifactModeProvided) throw new CliUsageError("--artifact-mode may be provided once");
        if (value !== "trackable" && value !== "local") {
          throw new CliUsageError("--artifact-mode must be trackable or local");
        }
        artifactMode = value;
        artifactModeProvided = true;
        break;
      default:
        throw new CliUsageError(`Unknown option: ${option}`);
    }

    index += 1;
  }

  if (feature === undefined) {
    throw new CliUsageError("--feature is required");
  }

  if (command === "status" && phase !== undefined) {
    throw new CliUsageError("--phase is only valid with run");
  }

  return { command, feature, target, phase, artifactMode };
}
