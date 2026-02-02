---
name: pencil-ui
description: 使用 Pencil MCP 绘制 UI 界面。当用户要求设计 UI、创建界面、画页面时使用此 skill。
allowed-tools:
  - mcp__pencil__*
  - Read
  - Glob
---

# Pencil UI 设计工作流

当被要求使用 Pencil 绘制 UI 时，必须按以下步骤执行：

## 第一步：读取设计规则（强制）

在进行任何设计操作之前，**必须先读取项目设计规则**：

```
Read .claude/rules/pencil-ui-rules.md
```

该文件包含所有核心原则、组件分层、状态变体组织、命名规范和已知 Bug，是唯一规则来源。

## 第二步：了解当前环境

1. 使用 `get_editor_state` 了解当前打开的 .pen 文件
2. 使用 `get_variables` 读取当前文件中定义的 Design Tokens
3. 使用 `batch_get` 查看现有可复用组件（`patterns: [{"reusable": true}]`）

## 第三步：获取设计指南

根据任务类型，使用 `get_guidelines` 获取相应指南（landing-page / design-system / table / code / tailwind）。

如果是全新设计，可用 `get_style_guide_tags` + `get_style_guide` 获取灵感。

## 第四步：执行设计

使用 `batch_design` 进行设计，严格遵守 `pencil-ui-rules.md` 中的四条核心原则和所有强制规则。

## 第五步：验证设计

使用 `get_screenshot` 获取截图，检查布局是否正确、是否有视觉错误。
