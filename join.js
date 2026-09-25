// join.js：按续行符把物理行合并成逻辑行
export function joinLines(lines, marker) {
  if (!marker) {
    const error = new Error("E_NO_MARKER: continuation marker is empty");
    error.code = "E_NO_MARKER";
    throw error;
  }
  const logical = [];
  const mapping = [];
  let buffer = "";
  let start = 0;
  let open = false;
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!open) { open = true; start = index; buffer = ""; }
    if (line.endsWith(marker)) {
      buffer += line.slice(0, line.length - marker.length);
    } else {
      logical.push(buffer + line);
      mapping.push([start, index]);
      open = false;
    }
  }
  if (open) {
    logical.push(buffer);
    mapping.push([start, lines.length - 1]);
  }
  return { logical, mapping };
}
