import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import test from "node:test";

import { getPhase } from "../src/core/phases.js";
import { buildPhasePrompt } from "../src/core/prompts.js";
import { CodexRuntime } from "../src/runtime/codex.js";

test("runs codex exec in the target without a shell", async () => {
  const calls: Array<{ command: string; args: readonly string[]; shell: unknown }> = [];
  const runtime = new CodexRuntime({
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
    command: "codex",
    args: ["exec", "-C", "C:/repo", "-s", "workspace-write", "-"],
    shell: false,
  }]);
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
  assert.match(prompt, /Do not create artifacts from later phases/);
});
