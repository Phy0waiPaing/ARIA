#!/usr/bin/env node

import { CliUsageError, formatUsage, parseArgs } from "./cli/args.js";

function main(argv: string[]): void {
  if (argv.length === 1 && (argv[0] === "--help" || argv[0] === "-h")) {
    console.log(formatUsage());
    return;
  }

  try {
    parseArgs(argv);
  } catch (error) {
    if (error instanceof CliUsageError) {
      console.error(error.message);
      console.error(formatUsage());
      process.exitCode = 2;
      return;
    }

    throw error;
  }

  console.error("ARIA workflow execution is not available yet.");
  process.exitCode = 1;
}

main(process.argv.slice(2));
