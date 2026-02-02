# Design Tokens 对比文档

## 数据来源

- **设计文件**: `doc/ui/pencil-main.pen`
- **代码文件**: `packages/component/global.css` + `packages/common/theme.ts`

---

## 主题系统

### 设计文件定义

| 主题轴 | 可选值 |
|-------|-------|
| Device | Phone, Tablet, Desktop |
| Mode | Light, Dark |

### 代码实现

| 主题轴 | 可选值 |
|-------|-------|
| Mode | light, dark (通过 CSS class `.dark`) |

**差异**: 代码缺少 Device 响应式支持

---

## 颜色变量对比

### 基础语义色 (设计与代码一致)

| 变量名 | Light | Dark | 代码状态 |
|--------|-------|------|---------|
| `--background` | #fafafa | #0a0a0a | ✅ 有 (HSL格式) |
| `--foreground` | #0a0a0a | #fafafa | ✅ 有 |
| `--card` | #ffffff | #171717 | ✅ 有 |
| `--card-foreground` | #0a0a0a | #fafafa | ✅ 有 |
| `--popover` | #ffffff | #171717 | ✅ 有 |
| `--popover-foreground` | #0a0a0a | #fafafa | ✅ 有 |
| `--primary` | #171717 | #fafafa | ✅ 有 |
| `--primary-foreground` | #fafafa | #171717 | ✅ 有 |
| `--secondary` | #f5f5f5 | #262626 | ✅ 有 |
| `--secondary-foreground` | #171717 | #fafafa | ✅ 有 |
| `--muted` | #f5f5f5 | #262626 | ✅ 有 |
| `--muted-foreground` | #737373 | #a3a3a3 | ✅ 有 |
| `--accent` | #f5f5f5 | #262626 | ✅ 有 |
| `--accent-foreground` | #171717 | #fafafa | ✅ 有 |
| `--destructive` | #dc2626 | #ef4444 | ✅ 有 |
| `--destructive-foreground` | #ffffff | #ffffff | ❌ 缺失 |
| `--border` | #e5e5e5 | #262626 | ✅ 有 |
| `--input` | #e5e5e5 | #262626 | ✅ 有 |
| `--ring` | #0a0a0a | #fafafa | ✅ 有 |
| `--black` | #000000 | - | ❌ 缺失 |
| `--white` | #ffffff | - | ❌ 缺失 |

### 业务色 (记账专用) - 代码全部缺失

| 变量名 | Light | Dark | 用途 |
|--------|-------|------|------|
| `--expense` | #dc2626 | #ef4444 | 支出主色 |
| `--expense-foreground` | #ffffff | #450a0a | 支出文字 |
| `--expense-muted` | #fee2e2 | #7f1d1d | 支出背景 |
| `--income` | #16a34a | #22c55e | 收入主色 |
| `--income-foreground` | #ffffff | #052e16 | 收入文字 |
| `--income-muted` | #dcfce7 | #14532d | 收入背景 |
| `--transfer` | #2563eb | #3b82f6 | 转账主色 |
| `--transfer-foreground` | #ffffff | #172554 | 转账文字 |
| `--transfer-muted` | #dbeafe | #1e3a8a | 转账背景 |

---

## 间距变量 (代码全部缺失)

| 变量名 | Phone | Tablet | Desktop |
|--------|-------|--------|---------|
| `--spacing-1` | 4 | 4 | 4 |
| `--spacing-2` | 8 | 8 | 8 |
| `--spacing-3` | 12 | 12 | 14 |
| `--spacing-4` | 16 | 16 | 18 |
| `--spacing-5` | 20 | 24 | 24 |
| `--spacing-6` | 24 | 28 | 32 |
| `--spacing-8` | 32 | 40 | 48 |
| `--spacing-10` | 40 | 48 | 56 |
| `--spacing-12` | 48 | 56 | 64 |

---

## 圆角变量

| 变量名 | Phone | Tablet | Desktop | 代码状态 |
|--------|-------|--------|---------|---------|
| `--radius-none` | 0 | 0 | 0 | ❌ 缺失 |
| `--radius-sm` | 4 | 4 | 6 | ✅ 有 (calc) |
| `--radius-md` | 8 | 8 | 10 | ✅ 有 (calc) |
| `--radius-lg` | 12 | 12 | 14 | ✅ 有 (--radius) |
| `--radius-xl` | 16 | 18 | 20 | ❌ 缺失 |
| `--radius-full` | 9999 | 9999 | 9999 | ❌ 缺失 |

---

## 字体大小 (代码全部缺失)

| 变量名 | Phone | Tablet | Desktop |
|--------|-------|--------|---------|
| `--text-xs` | 11 | 12 | 12 |
| `--text-sm` | 13 | 14 | 14 |
| `--text-base` | 15 | 16 | 16 |
| `--text-lg` | 17 | 18 | 18 |
| `--text-xl` | 20 | 22 | 24 |
| `--text-2xl` | 24 | 28 | 32 |
| `--text-3xl` | 30 | 36 | 40 |

---

## 组件尺寸变量 (代码全部缺失)

### 按钮高度

| 变量名 | Phone | Tablet | Desktop |
|--------|-------|--------|---------|
| `--button-height-sm` | 32 | 34 | 36 |
| `--button-height-md` | 40 | 42 | 44 |
| `--button-height-lg` | 48 | 52 | 56 |

### 图标尺寸

| 变量名 | Phone | Tablet | Desktop |
|--------|-------|--------|---------|
| `--icon-xs` | 14 | 16 | 16 |
| `--icon-sm` | 18 | 20 | 20 |
| `--icon-md` | 22 | 24 | 24 |
| `--icon-lg` | 28 | 32 | 32 |
| `--icon-xl` | 36 | 40 | 48 |

### 头像尺寸

| 变量名 | Phone | Tablet | Desktop |
|--------|-------|--------|---------|
| `--avatar-sm` | 32 | 36 | 40 |
| `--avatar-md` | 40 | 44 | 48 |
| `--avatar-lg` | 56 | 64 | 72 |

### 其他组件

| 变量名 | Phone | Tablet | Desktop | 用途 |
|--------|-------|--------|---------|------|
| `--input-height` | 44 | 44 | 48 | 输入框高度 |
| `--list-item-height` | 64 | 72 | 80 | 列表项高度 |
| `--card-padding` | 16 | 20 | 24 | 卡片内边距 |
| `--page-padding` | 16 | 24 | 32 | 页面内边距 |
| `--fab-size` | 56 | 60 | 64 | 浮动按钮尺寸 |
| `--category-icon-size` | 40 | 44 | 48 | 分类图标尺寸 |
| `--tab-bar-height` | 64 | 72 | 0 | Tab Bar 高度 |

---

## 差异总结

### 代码需要新增的变量

**颜色 (3个)**
- `--destructive-foreground`
- `--black`
- `--white`

**业务色 (9个)**
- `--expense`, `--expense-foreground`, `--expense-muted`
- `--income`, `--income-foreground`, `--income-muted`
- `--transfer`, `--transfer-foreground`, `--transfer-muted`

**间距 (9个)**
- `--spacing-1` ~ `--spacing-12`

**圆角 (2个)**
- `--radius-xl`
- `--radius-full`

**字体 (7个)**
- `--text-xs` ~ `--text-3xl`

**组件尺寸 (15个)**
- 按钮、图标、头像、输入框等

### 代码格式需要调整

当前代码使用 HSL 格式，设计使用 HEX 格式，需要统一。

### Device 响应式支持

设计文件支持 Phone/Tablet/Desktop 三套尺寸，代码目前不支持设备适配。

---

## 建议实施计划

1. **Phase 1**: 补齐缺失的颜色变量
2. **Phase 2**: 添加业务色 (expense/income/transfer)
3. **Phase 3**: 添加间距和字体变量
4. **Phase 4**: 添加组件尺寸变量
5. **Phase 5**: 实现 Device 响应式支持
