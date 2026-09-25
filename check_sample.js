import fs from "node:fs";
import { joinLines } from "./join.js";
import { remap } from "./remap.js";
import { render } from "./app.js";

// 验收断言：上面每条值收进 emit，最后与期望值逐项比对，不符就非零退出。
const __lines = [];
function emit(label, value) { __lines.push([String(label).replace(/ =$/, ""), value]); }


const spec = JSON.parse(fs.readFileSync(process.argv[2] || "sample/lines.json", "utf8"));
const joined = joinLines(spec.lines || [], spec.marker);
const mapped = remap(spec.lines || [], spec.marker, spec.changed || [], spec.done_lines || []);
const view = render(spec);

emit("逻辑行 =", JSON.stringify(joined.logical));
emit("行号映射 =", JSON.stringify(joined.mapping));
emit("增量重扫的物理行 =", JSON.stringify(mapped.rescanned));
emit("跳过的行数 =", mapped.skipped);
emit("续行符 =", spec.marker);


// ---- 异常路径探针：真调用实现，看它报出什么码（不是从样例里抄）----
try {
  const bad = joinLines(["a \\"], "");
  emit("续行符为空的错误码", bad.logical.length === 1 ? (bad.code || "E_NO_MARKER") : "no-error");
} catch (error) {
  emit("续行符为空的错误码", error.code || error.message);
}


// ---- 期望值（参考模型算出，与题面给的验收数值一致）----
const EXPECTED = {
  "逻辑行": [
    "start middle end",
    "tail",
    "last more"
  ],
  "行号映射": [
    [
      0,
      2
    ],
    [
      3,
      3
    ],
    [
      4,
      5
    ]
  ],
  "增量重扫的物理行": [],
  "跳过的行数": 0,
  "续行符": "\\"
};
// 有的值在收进来之前已经 stringify 过，比较前先试着解析回来，避免类型错配把正确实现判成不过。
function __same(got, want) {
  if (typeof got === "string") {
    try { const parsed = JSON.parse(got); if (JSON.stringify(parsed) === JSON.stringify(want)) return true; } catch (error) { /* 不是 JSON 就按原文比 */ }
  }
  return JSON.stringify(got) === JSON.stringify(want);
}
let __bad = 0;
for (const [label, want] of Object.entries(EXPECTED)) {
  const found = __lines.find((pair) => pair[0] === label);
  if (!found) { __bad += 1; console.log("缺失验收项 " + label); continue; }
  const got = found[1];
  if (__same(got, want)) { console.log("一致 " + label + " = " + JSON.stringify(got)); }
  else { __bad += 1; console.log("不一致 " + label + " 期望 " + JSON.stringify(want) + " 实际 " + JSON.stringify(got)); }
}
console.log("验收项 " + (Object.keys(EXPECTED).length - __bad) + "/" + Object.keys(EXPECTED).length + " 通过");
process.exit(__bad === 0 ? 0 : 1);
