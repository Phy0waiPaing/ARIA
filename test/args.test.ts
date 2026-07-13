import assert from "node:assert/strict";
import test from "node:test";

import { formatUsage, parseArgs } from "../src/cli/args.js";

test("parses run with feature and defaults target to cwd", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    artifactMode: "trackable",
  });
});

test("usage documents run and status", () => {
  assert.match(formatUsage(), /aria run --feature <slug>/);
  assert.match(formatUsage(), /aria status --feature <slug>/);
});
