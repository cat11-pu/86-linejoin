// app.js：渲染结果
import { joinLines } from "./join.js";
import { remap } from "./remap.js";

export function render(spec) {
  const lines = spec.lines || [];
  const marker = spec.marker;
  const changed = spec.changed || [];
  const done = spec.done_lines || [];
  const joined = joinLines(lines, marker);
  const mapped = remap(lines, marker, changed, done);
  const repeat = remap(lines, marker, changed, done);
  const idempotent = JSON.stringify(mapped) === JSON.stringify(repeat);
  return { logical: joined.logical, mapping: joined.mapping, rescanned: mapped.rescanned,
           skipped: mapped.skipped, idempotent: idempotent };
}
