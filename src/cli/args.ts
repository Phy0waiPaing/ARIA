export type CommandName = "run" | "revise" | "status" | "doctor" | "upgrade" | "uninstall";

export interface ParsedCommand {
  command: CommandName;
  feature: string | undefined;
  target: string;
  phase: string | undefined;
  model: string | undefined;
  brief: string | undefined;
  message: string | undefined;
  strict: boolean;
  json: boolean;
  verbose: boolean;
}

export class CliUsageError extends Error {}

export function formatUsage(): string {
  return [
    "Usage:",
    "  aria run --feature <slug> [--brief <text>] [--phase <phase>] [--target <path>] [--model <model>] [--verbose]",
    "  aria revise --feature <slug> --message <text> [--target <path>] [--model <model>] [--verbose]",
    "  aria status --feature <slug> [--target <path>]",
    "  aria doctor [--target <path>] [--strict] [--json]",
    "  aria upgrade",
    "  aria uninstall",
  ].join("\n");
}

export function parseArgs(argv: string[]): ParsedCommand {
  const [command, ...rest] = argv;

  if (command !== "run" && command !== "revise" && command !== "status" && command !== "doctor" && command !== "upgrade" && command !== "uninstall") {
    throw new CliUsageError(`Unknown command: ${command ?? ""}`.trim());
  }

  if ((command === "upgrade" || command === "uninstall") && rest.length > 0) {
    throw new CliUsageError(`${command} does not accept options`);
  }

  let feature: string | undefined;
  let target = process.cwd();
  let phase: string | undefined;
  let model: string | undefined;
  let brief: string | undefined;
  let message: string | undefined;
  let targetProvided = false;
  let verbose = false;
  let strict = false;
  let json = false;

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

    if (option === "--strict") {
      if (strict) throw new CliUsageError("--strict may be provided once");
      strict = true;
      continue;
    }

    if (option === "--json") {
      if (json) throw new CliUsageError("--json may be provided once");
      json = true;
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
      case "--brief":
        if (brief !== undefined) throw new CliUsageError("--brief may be provided once");
        brief = value;
        break;
      case "--message":
        if (message !== undefined) throw new CliUsageError("--message may be provided once");
        message = value;
        break;
      default:
        throw new CliUsageError(`Unknown option: ${option}`);
    }

    index += 1;
  }

  if ((command === "run" || command === "revise" || command === "status") && feature === undefined) {
    throw new CliUsageError("--feature is required");
  }

  if (command !== "run" && phase !== undefined) {
    throw new CliUsageError("--phase is only valid with run");
  }

  if (command !== "run" && command !== "revise" && model !== undefined) {
    throw new CliUsageError("--model is only valid with run or revise");
  }

  if (command !== "run" && command !== "revise" && verbose) {
    throw new CliUsageError("--verbose is only valid with run or revise");
  }

  if (command !== "doctor" && strict) {
    throw new CliUsageError("--strict is only valid with doctor");
  }

  if (command !== "doctor" && json) {
    throw new CliUsageError("--json is only valid with doctor");
  }

  if (command !== "run" && brief !== undefined) {
    throw new CliUsageError("--brief is only valid with run");
  }

  if (command !== "revise" && message !== undefined) {
    throw new CliUsageError("--message is only valid with revise");
  }

  if (command === "revise" && message === undefined) {
    throw new CliUsageError("--message is required with revise");
  }

  return { command, feature, target, phase, model, brief, message, strict, json, verbose };
}
