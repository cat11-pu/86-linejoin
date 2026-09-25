import assert from "node:assert";
import { joinLines } from "../join.js";
import { remap } from "../remap.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

const lines = ["a \\", "b", "c"];

check("joinLines returns logical", () => {
  assert.ok(Array.isArray(joinLines(lines, "\\").logical));
});

check("joinLines returns mapping", () => {
  assert.ok(Array.isArray(joinLines(lines, "\\").mapping));
});

check("remap returns rescanned", () => {
  assert.ok(Array.isArray(remap(lines, "\\", [], []).rescanned));
});

check("remap reports skipped", () => {
  assert.strictEqual(typeof remap(lines, "\\", [], []).skipped, "number");
});

check("render exposes idempotent flag", () => {
  assert.strictEqual(typeof render({ lines: lines, marker: "\\", changed: [], done_lines: [] }).idempotent, "boolean");
});

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
