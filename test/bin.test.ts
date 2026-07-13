import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";

test("help output documents aria invocations", () => {
  const output = execFileSync(process.execPath, [path.resolve("dist/src/bin.js"), "--help"], {
    encoding: "utf8",
  });

  assert.match(output, /aria run --feature <slug>/);
  assert.match(output, /aria status --feature <slug>/);
});
