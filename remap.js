// remap.js：行号映射与增量（基线：整份重扫）
import { joinLines } from "./join.js";

export function remap(lines, marker, changed, done) {
  const joined = joinLines(lines, marker);
  return { logical: joined.logical, rescanned: lines.map((line, index) => index), skipped: 0 };
}
