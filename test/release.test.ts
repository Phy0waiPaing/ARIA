import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { PassThrough } from "node:stream";
import test from "node:test";

import { ReleaseManager } from "../src/core/release.js";

test("upgrades from the configured release branch without a shell", async () => {
  const calls: Array<{ command: string; args: readonly string[]; shell: unknown }> = [];
  const manager = new ReleaseManager({
    config: {
      packageName: "aria-orchestrator",
      releaseSource: "github:Phy0waiPaing/ARIA#release",
    },
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

  const result = await manager.upgrade();

  assert.equal(result.exitCode, 0);
  assert.deepEqual(calls, [{
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["install", "-g", "--install-links=true", "github:Phy0waiPaing/ARIA#release"],
    shell: false,
  }]);
});

test("uninstalls only the configured global package", async () => {
  const calls: Array<{ command: string; args: readonly string[] }> = [];
  const manager = new ReleaseManager({
    config: {
      packageName: "aria-orchestrator",
      releaseSource: "github:Phy0waiPaing/ARIA#release",
    },
    spawnImpl(command, args) {
      calls.push({ command, args });
      const child = Object.assign(new EventEmitter(), {
        stdin: new PassThrough(),
        stdout: new PassThrough(),
        stderr: new PassThrough(),
      });
      process.nextTick(() => child.emit("close", 0));
      return child as never;
    },
  });

  await manager.uninstall();

  assert.deepEqual(calls, [{
    command: process.platform === "win32" ? "npm.cmd" : "npm",
    args: ["uninstall", "-g", "aria-orchestrator"],
  }]);
});
