---
name: pencil-code
description: 根据 Pencil MCP 设计稿生成 1:1 还原的 UI 代码。当用户要求根据设计生成代码、还原 UI、实现页面时使用此 skill。
allowed-tools:
  - mcp__pencil__*
  - mcp__chrome-devtools__*
  - Read
  - Write
  - Edit
  - Glob
  - Grep
  - Bash
---

# Pencil → Code 1:1 还原工作流

根据 Pencil MCP 设计稿生成代码时，目标是 **100% 像素级还原**。必须按以下步骤严格执行。

## 前置步骤：读取设计规则（强制）

在进行任何操作之前，**必须先读取项目设计规则**：

```
Read .claude/rules/pencil-ui-rules.md
```

该文件包含所有核心原则、组件分层、状态变体组织、命名规范，是唯一规则来源。

---

## 阶段一：对齐 Design Tokens

在写任何 UI 代码之前，先确保代码侧的 Design Tokens 和 Pencil 设计稿完全一致。

1. 使用 `get_variables` 读取 .pen 文件中的所有 Design Tokens
2. 读取代码中的 `global.css`（或对应的 tokens 文件）
3. **逐一比对**每个 token 的值（颜色、间距、圆角、字体等）
4. 如果有差异，**先修正代码侧的 tokens**，使其与设计稿一致
5. 如果设计稿缺少必要的 token，向用户反馈

**不对齐 tokens 就不能进入下一阶段。**

---

## 阶段二：对齐通用组件

确保代码中的通用组件与 Pencil 设计稿中的可复用组件一致。

1. 使用 `batch_get` 搜索设计稿中的可复用组件（`patterns: [{"reusable": true}]`）
2. 对照代码中的组件库
3. 检查每个组件的尺寸、间距、圆角、颜色、文字样式、布局结构
4. 如果有差异，**先修正组件代码**
5. 如果设计稿有新组件但代码中不存在，先创建该组件

**不对齐组件就不能进入下一阶段。**

---

## 阶段三：1:1 还原页面 UI

在 tokens 和组件都对齐之后，开始实现具体页面。

1. 使用 `batch_get` 读取目标页面的**完整节点树**（readDepth 设为 3-5）
2. 使用 `get_screenshot` 获取设计稿截图作为对照参考
3. **检查页面旁边是否有开发备注**（`Dev Note - 功能名`），这些包含关键的交互说明和实现要求

### 还原页面默认状态

逐层还原设计稿结构，严格对应每个节点的属性：

- `layout` → flexDirection
- `gap` → gap
- `padding` → padding（注意数组格式的顺序）
- `alignItems` / `justifyContent` → 对应 flex 属性
- `fill` → backgroundColor
- `stroke` → border
- `cornerRadius` → borderRadius
- `fontSize` / `fontWeight` / `lineHeight` → 文字样式

### 还原组件状态变体（关键）

按 `pencil-ui-rules.md` 中定义的组织规则，主页面右侧横向排列着状态变体 frame（`组件名 States`）。

1. 使用 `snapshot_layout` 或 `batch_get` 查找主页面**右侧相邻**的 States frame
2. 读取每个 States frame 的内容，了解该组件在不同状态下的样式差异
3. **每个状态变体都必须在代码中实现**（交互状态、数据状态、业务状态）
4. 对比 States frame 中各变体与默认状态的**差异属性**，在代码中通过 props、state 或条件渲染体现
5. 如果有子页面，同样检查子页面右侧是否有对应的 States frame

**忽略状态变体等于没有完成还原。**

---

## 阶段四：自动化视觉对比

代码完成后，**必须自行验证**，不要交给用户去检查。

### 默认状态对比（循环执行直到一致）：

1. 确保开发服务器正在运行
2. 使用 Chrome MCP 导航到目标页面：`navigate_page`
3. 使用 Chrome MCP 截图：`take_screenshot`
4. 使用 Pencil MCP 截图：`get_screenshot`
5. **逐一对比两张截图**，检查整体布局、间距、字体、颜色、圆角、图标、对齐方式
6. 如果有差异 → 修改代码 → 重新截图 → 再次对比
7. **重复此循环，直到两张截图完全一致**

### 状态变体对比：

对每个在阶段三中识别的状态变体：

1. 使用 Chrome MCP 的 `click`、`hover`、`fill` 等操作触发对应状态
2. 使用 Chrome MCP 截图当前状态
3. 使用 Pencil MCP 截图对应的 States frame 中的变体
4. 对比两张截图，要求 1:1 一致
5. 不一致则修改代码，重复对比

**每个状态变体都必须单独验证。**

---

## 核心原则

- **设计稿是唯一真理**：代码必须服从设计稿，而非反过来
- **先基础后页面**：tokens → 组件 → 页面，顺序不可打乱
- **状态变体必须实现**：主页面右侧的 States frame 定义了所有状态，全部要还原到代码中
- **自行验证**：不要把「检查是否一致」交给用户，你自己对比截图
- **持续迭代**：对比 → 修改 → 对比，直到完全一致才算完成
- **读备注**：页面旁边的 Dev Notes 包含关键实现细节，必须阅读
