import assert from "node:assert/strict";
import test from "node:test";

import { formatUsage, parseArgs } from "../src/cli/args.js";

test("parses run with feature and defaults target to cwd", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: false,
  });
});

test("usage documents run and status", () => {
  assert.match(formatUsage(), /aria run --feature <slug>/);
  assert.match(formatUsage(), /aria revise --feature <slug>/);
  assert.match(formatUsage(), /aria status --feature <slug>/);
  assert.match(formatUsage(), /aria doctor/);
  assert.match(formatUsage(), /aria upgrade/);
  assert.match(formatUsage(), /aria uninstall/);
});

test("parses release-management commands without a feature", () => {
  assert.deepEqual(parseArgs(["upgrade"]), {
    command: "upgrade",
    feature: undefined,
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: false,
  });
  assert.deepEqual(parseArgs(["uninstall"]), {
    command: "uninstall",
    feature: undefined,
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: false,
  });
});

test("parses model as an opt-in run value", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--model", "gpt-5"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    model: "gpt-5",
    brief: undefined,
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: false,
  });
});

test("parses verbose as an opt-in run flag", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "monitoring-dashboard-v2", "--verbose"]), {
    command: "run",
    feature: "monitoring-dashboard-v2",
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: true,
  });
});

test("parses initial requirement brief for run", () => {
  assert.deepEqual(parseArgs(["run", "--feature", "role-crud-v2", "--brief", "Create role only needs a name for now. Permissions come later."]), {
    command: "run",
    feature: "role-crud-v2",
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: "Create role only needs a name for now. Permissions come later.",
    message: undefined,
    strict: false,
    json: false,
    allowExtra: false,
    verbose: false,
  });
});

test("parses revise feedback as a runnable command", () => {
  assert.deepEqual(parseArgs(["revise", "--feature", "role-crud-v2", "--message", "Use the existing SVMP table density.", "--allow-extra"]), {
    command: "revise",
    feature: "role-crud-v2",
    target: process.cwd(),
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: "Use the existing SVMP table density.",
    strict: false,
    json: false,
    allowExtra: true,
    verbose: false,
  });
});

test("parses doctor with target and strict json output", () => {
  assert.deepEqual(parseArgs(["doctor", "--target", "D:/repo", "--strict", "--json"]), {
    command: "doctor",
    feature: undefined,
    target: "D:/repo",
    phase: undefined,
    model: undefined,
    brief: undefined,
    message: undefined,
    strict: true,
    json: true,
    allowExtra: false,
    verbose: false,
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
    /--verbose is only valid with run or revise/,
  );
});

test("rejects model outside run", () => {
  assert.throws(
    () => parseArgs(["status", "--feature", "monitoring-dashboard-v2", "--model", "gpt-5"]),
    /--model is only valid with run or revise/,
  );
});

test("rejects missing revise message", () => {
  assert.throws(
    () => parseArgs(["revise", "--feature", "role-crud-v2"]),
    /--message is required with revise/,
  );
});

test("rejects doctor flags outside doctor", () => {
  assert.throws(
    () => parseArgs(["run", "--feature", "role-crud-v2", "--strict"]),
    /--strict is only valid with doctor/,
  );
  assert.throws(
    () => parseArgs(["status", "--feature", "role-crud-v2", "--json"]),
    /--json is only valid with doctor/,
  );
});

test("rejects allow-extra outside revise", () => {
  assert.throws(
    () => parseArgs(["run", "--feature", "role-crud-v2", "--allow-extra"]),
    /--allow-extra is only valid with revise/,
  );
});
