// join.js：合并（基线：不处理续行符）
export function joinLines(lines, marker) {
  return { logical: lines.slice(), mapping: lines.map((line, index) => [index, index]) };
}
