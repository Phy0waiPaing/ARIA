import assert from "node:assert/strict";
import test from "node:test";

import { formatUsage, parseArgs } from "../src/cli/args.js";

test("parses run with feature and defaults target to cwd", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    verbose: false,
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
    verbose: false,
  });
  assert.deepEqual(parseArgs(["uninstall"]), {
    command: "uninstall",
    feature: undefined,
    target: process.cwd(),
    phase: undefined,
    verbose: false,
  });
});

test("parses verbose as an opt-in run flag", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--verbose"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    verbose: true,
  });
});

test("rejects duplicate single-value options", () => {
  assert.throws(
    () => parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--target", "one", "--target", "two"]),
    /--target may be provided once/,
  );
});

test("rejects artifact mode as a user-facing option", () => {
  assert.throws(
    () => parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--artifact-mode", "local"]),
    /unknown option/i,
  );
});

test("rejects verbose outside run", () => {
  assert.throws(
    () => parseArgs(["status", "--feature", "monitoring-dashboard-v2", "--verbose"]),
    /--verbose is only valid with run/,
  );
});
