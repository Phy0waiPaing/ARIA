export type CommandName = "run" | "status" | "upgrade" | "uninstall";

export interface ParsedCommand {
  command: CommandName;
  feature: string | undefined;
  target: string;
  phase: string | undefined;
  model: string | undefined;
  verbose: boolean;
}

export class CliUsageError extends Error {}

export function formatUsage(): string {
  return [
    "Usage:",
    "  aria run --feature <slug> [--phase <phase>] [--target <path>] [--model <model>] [--verbose]",
    "  aria status --feature <slug> [--target <path>]",
    "  aria upgrade",
    "  aria uninstall",
  ].join("\n");
}

export function parseArgs(argv: string[]): ParsedCommand {
  const [command, ...rest] = argv;

  if (command !== "run" && command !== "status" && command !== "upgrade" && command !== "uninstall") {
    throw new CliUsageError(`Unknown command: ${command ?? ""}`.trim());
  }

  if ((command === "upgrade" || command === "uninstall") && rest.length > 0) {
    throw new CliUsageError(`${command} does not accept options`);
  }

  let feature: string | undefined;
  let target = process.cwd();
  let phase: string | undefined;
  let model: string | undefined;
  let targetProvided = false;
  let verbose = false;

  for (let index = 0; index < rest.length; index += 1) {
    const option = rest[index];
    const value = rest[index + 1];

    if (!option?.startsWith("--")) {
      throw new CliUsageError(`Unexpected argument: ${option ?? ""}`.trim());
    }

    if (option === "--verbose") {
      if (verbose) throw new CliUsageError("--verbose may be provided once");
      verbose = true;
      continue;
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
      case "--model":
        if (model !== undefined) throw new CliUsageError("--model may be provided once");
        model = value;
        break;
      default:
        throw new CliUsageError(`Unknown option: ${option}`);
    }

    index += 1;
  }

  if ((command === "run" || command === "status") && feature === undefined) {
    throw new CliUsageError("--feature is required");
  }

  if (command === "status" && phase !== undefined) {
    throw new CliUsageError("--phase is only valid with run");
  }

  if (command !== "run" && model !== undefined) {
    throw new CliUsageError("--model is only valid with run");
  }

  if (command !== "run" && verbose) {
    throw new CliUsageError("--verbose is only valid with run");
  }

  return { command, feature, target, phase, model, verbose };
}
