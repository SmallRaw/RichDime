# Pencil UI 设计规范

本文件是 Pencil 设计稿与代码实现的**唯一规则来源**。`/pencil-ui` 和 `/pencil-code` 两个 skill 均引用此文件。

---

## 核心设计原则

### 原则 1：强制优先使用 Design Token

所有颜色、间距、圆角、字体大小等值，**必须使用文件中已定义的 Design Token**（`$--variable-name` 格式），禁止硬编码任何数值。如果没有合适的 token，先询问用户是否需要新增。

违反此规则不可接受，没有例外。

### 原则 2：优先使用现有通用组件

绘制或编码前先检查是否已有可复用组件能满足需求。能用现有组件的，直接用 `ref` 引用（设计稿）或导入组件（代码），不要重复造轮子。

### 原则 3：没有通用组件时才自行绘制

只有确认不存在可复用组件时，才允许从零绘制新 UI 元素或编写新组件。

### 原则 4：相似内容必须抽象为通用组件

如果相似的 UI 元素出现多次，必须将其抽象为通用组件：
- 设计稿中标记为 `reusable: true`
- 代码中提取为独立组件文件

---

## 组件分层原则

### Components 区域（基础组件）

**只放通用的、跨业务的基础 UI 组件**

适合放入：Button/\*、Badge/\*、Input/\*、Card/Base、ListItem/\*、Form/\*、NavItem/\*、Modal/Header、Tag/\*

**不要放入**：业务特定的组件（如 CLI Installation Section）、页面特定的状态变体

### 何时创建新的基础组件（强制规则）

当一个 UI 元素满足以下条件时，才考虑加入 Components：

- 在 3 个以上不同页面/功能中使用
- 是通用的 UI 模式，不包含业务逻辑
- 样式和行为是一致的

---

## 页面与状态变体的组织规则（强制规则）

### 画布布局

**每个功能独占一行，横向排列：** 主页面 → 组件状态变体 → 子页面 → 子页面状态变体 → ...

```
功能A:  [主页面] [Card1 States] [Card2 States] → [子页面A-2] [A-2 States] → ...
功能B:  [主页面] [CardX States] → ...
```

### 状态变体规则

- 按组件拆分，每个组件单独一个 States frame（如 `CLI Card States`、`Engine Card States`）
- States frame 内包含该组件的所有状态变体
- **禁止复制整个主页面来表示不同状态**，只画变化的组件/Section

### 常见状态类型

States frame 中应涵盖组件可能具有的状态，包括但不限于：

- **交互状态**：Default / Active / Disabled / Selected / Hover / Pressed / Focused
- **数据状态**：Empty State / Loading State / Error State
- **业务状态**：根据具体业务定义（如「已支付」「待审核」等）

### 开发备注（Dev Notes）

页面旁边可能包含开发备注 frame，命名为 `Dev Note - 功能名`，包含关键的交互说明和实现要求。设计和编码时都必须阅读。

---

## 命名规范（强制规则）

| 类型 | 格式 | 示例 |
|------|------|------|
| 基础组件 | `Category/Variant` | `Button/Primary` |
| 业务主页面 | `App Name - Feature` | `Bookkeeping - Add Transaction` |
| 状态变体 | `组件名 States` | `CLI Card States` |
| 开发备注 | `Dev Note - 功能名` | `Dev Note - Category Wheel` |

---

## 屏幕高度规范

屏幕 Frame 高度使用 `hug`（自适应内容），不要设置固定高度导致内容被截断不可见。

---

## UI 代码变更（强制规则）

涉及 UI 的代码变更，**必须调用 `/pencil-code` skill 完成完整的验证闭环**，不得跳过。

---

## Pencil MCP 已知 Bug

使用 token 设置 padding 时单个值无效，必须用数组格式如 `["$spacing-4", "$spacing-4"]`。
