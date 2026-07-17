import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import path from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";

import { getPhase } from "../src/core/phases.js";
import { buildPhasePrompt } from "../src/core/prompts.js";
import { CodexRuntime, findWindowsCodexScript } from "../src/runtime/codex.js";

test("runs codex exec in the target without a shell", async () => {
  const calls: Array<{ command: string; args: readonly string[]; shell: unknown }> = [];
  const runtime = new CodexRuntime({
    executable: "codex-bin",
    spawnImpl(command, args, options) {
      calls.push({ command, args, shell: options.shell });
      const child = Object.assign(new EventEmitter(), {
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });
      process.nextTick(() => child.emit("close", 0));
      return child as never;
    },
  });

  const result = await runtime.runPhase({
    targetRoot: "C:/repo",
    feature: "monitoring-dashboard-v2",
    phase: getPhase("project-context"),
    artifactMode: "local",
    answers: {},
  });

  assert.equal(result.exitCode, 0);
  assert.deepEqual(calls, [{
    command: "codex-bin",
    args: ["exec", "-C", "C:/repo", "-s", "workspace-write", "-"],
    shell: false,
  }]);
});

test("captures codex output without streaming it by default", async () => {
  const runtime = new CodexRuntime({
    executable: "codex-bin",
    spawnImpl() {
      const child = Object.assign(new EventEmitter(), {
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });
      process.nextTick(() => {
        child.stdout.write("stdout details");
        child.stderr.write("stderr details");
        child.emit("close", 1);
      });
      return child as never;
    },
  });

  const result = await runtime.runPhase({
    targetRoot: "C:/repo",
    feature: "monitoring-dashboard-v2",
    phase: getPhase("project-context"),
    artifactMode: "local",
    answers: {},
  });

  assert.equal(result.stdout, "stdout details");
  assert.equal(result.stderr, "stderr details");
});

test("finds the Windows Codex Node script rather than a command shim", () => {
  const first = path.join("C:", "tools");
  const second = path.join("C:", "codex");
  const script = findWindowsCodexScript(
    [first, second].join(path.delimiter),
    (candidate) => candidate === path.join(second, "node_modules", "@openai", "codex", "bin", "codex.js"),
  );

  assert.equal(script, path.join(second, "node_modules", "@openai", "codex", "bin", "codex.js"));
});

test("phase prompt names the feature, allowed outputs, and stop boundary", () => {
  const prompt = buildPhasePrompt({
    packageRoot: "C:/aria",
    targetRoot: "C:/repo",
    feature: "monitoring-dashboard-v2",
    phase: getPhase("project-context"),
    artifactMode: "local",
    answers: {},
  });

  assert.match(prompt, /monitoring-dashboard-v2/);
  assert.match(prompt, /project-context\.md/);
  assert.match(prompt, /visual-review\.md/);
  assert.match(prompt, /concrete visual evidence/);
  assert.match(prompt, /Do not create artifacts from later phases/);
});
