# linejoin

浏览器单页工作台（原生 ES 模块，零依赖）。

## 起服务看页面

    python3 -m http.server 8000

浏览器打开 http://127.0.0.1:8000/ ，改样例点运行看结果。

## 测试

    node tests/run.js

## 场景自检

    node check_sample.js

## 语义约定

- `joinLines(lines, marker)`：以续行符结尾的物理行与下一行拼成一个逻辑行（去掉续行符），
  返回 `logical` 与 `mapping`（每个逻辑行覆盖的物理行区间，全覆盖不重叠）；续行符为空抛 `E_NO_MARKER`。
- `remap(lines, marker, changed, done)`：`changed` 是改动的逻辑行下标，`done` 是已处理的物理行下标。
  改动逻辑行覆盖的全部物理行都重扫，其中已处理的跳过并计入 `skipped`；纯函数，重复执行结果相同。
