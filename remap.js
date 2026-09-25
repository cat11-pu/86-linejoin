// remap.js：行号映射与增量重扫
// changed 为改动的逻辑行下标，done 为已处理的物理行下标。
// 改动逻辑行覆盖的全部物理行都重扫；其中已处理的物理行跳过并计入 skipped；
// 全部物理行都已处理的逻辑行整体跳过，不再回扫。
import { joinLines } from "./join.js";

export function remap(lines, marker, changed, done) {
  const joined = joinLines(lines, marker);
  const mapping = joined.mapping;
  const doneSet = new Set(done);
  const seen = new Set();
  const rescanned = [];
  let skipped = 0;
  for (const entry of changed) {
    const logicalIndex = Number(entry);
    if (!Number.isInteger(logicalIndex) || logicalIndex < 0 || logicalIndex >= mapping.length) continue;
    if (seen.has(logicalIndex)) continue;
    seen.add(logicalIndex);
    const range = mapping[logicalIndex];
    const pending = [];
    let doneCount = 0;
    for (let physical = range[0]; physical <= range[1]; physical += 1) {
      if (doneSet.has(physical)) doneCount += 1;
      else pending.push(physical);
    }
    if (pending.length === 0) continue;
    skipped += doneCount;
    for (const physical of pending) rescanned.push(physical);
  }
  rescanned.sort((a, b) => a - b);
  return { logical: joined.logical, rescanned, skipped };
}
