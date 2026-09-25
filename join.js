// join.js：按续行符合并物理行为逻辑行，并记录每个逻辑行覆盖的物理行区间。
export function joinLines(lines, marker) {
  if (!marker) {
    const error = new Error("E_NO_MARKER");
    error.code = "E_NO_MARKER";
    throw error;
  }
  const logical = [];
  const mapping = [];
  let buffer = null;
  let start = 0;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (buffer === null) {
      buffer = "";
      start = index;
    }
    if (line.endsWith(marker)) {
      buffer += line.slice(0, line.length - marker.length);
    } else {
      logical.push(buffer + line);
      mapping.push([start, index]);
      buffer = null;
    }
  }
  if (buffer !== null) {
    logical.push(buffer);
    mapping.push([start, lines.length - 1]);
  }
  return { logical, mapping };
}
