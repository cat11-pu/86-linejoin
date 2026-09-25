// app.js：渲染结果
import { joinLines } from "./join.js";
import { remap } from "./remap.js";

export function render(spec) {
  const joined = joinLines(spec.lines || [], spec.marker);
  const mapped = remap(spec.lines || [], spec.marker, spec.changed || [], spec.done_lines || []);
  return { logical: joined.logical, mapping: joined.mapping, rescanned: mapped.rescanned,
           skipped: mapped.skipped, idempotent: true };
}
