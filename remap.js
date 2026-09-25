// remap.js：增量重扫。改动行所属逻辑行覆盖的全部物理行进入待重扫集合，
// 已处理过（done）的行跳过并计入 skipped，只返回真正需要重扫的物理行。
import { joinLines } from "./join.js";

export function remap(lines, marker, changed, done) {
  const joined = joinLines(lines, marker);
  const needed = new Set();
  for (const row of changed || []) {
    const range = joined.mapping[row];
    if (!range) continue;
    for (let index = range[0]; index <= range[1]; index += 1) needed.add(index);
  }
  const doneSet = new Set(done || []);
  const rescanned = [];
  for (const index of needed) {
    if (!doneSet.has(index)) rescanned.push(index);
  }
  rescanned.sort((a, b) => a - b);
  let skipped = 0;
  for (const index of doneSet) {
    if (!needed.has(index)) skipped += 1;
  }
  return { logical: joined.logical, rescanned, skipped };
}
