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
  assert.match(formatUsage(), /aria upgrade/);
  assert.match(formatUsage(), /aria uninstall/);
});

test("parses release-management commands without a feature", () => {
  assert.deepEqual(parseArgs(["upgrade"]), {
    command: "upgrade",
    feature: undefined,
    target: process.cwd(),
    phase: undefined,
    artifactMode: "trackable",
  });
  assert.deepEqual(parseArgs(["uninstall"]), {
    command: "uninstall",
    feature: undefined,
    target: process.cwd(),
    phase: undefined,
    artifactMode: "trackable",
  });
});

test("rejects duplicate single-value options", () => {
  assert.throws(
    () => parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--artifact-mode", "local", "--artifact-mode", "trackable"]),
    /--artifact-mode may be provided once/,
  );
});
