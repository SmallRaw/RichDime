# Components 对比文档

## 数据来源

- **设计文件**: `doc/ui/pencil-main.pen` (113 个可复用组件)
- **代码文件**: `packages/component/` (3 个组件)

---

## 组件实现状态总览

| 分类 | 设计组件数 | 已实现 | 待实现 |
|------|----------|--------|--------|
| Button | 16 | 1 | 15 |
| Form | 22 | 0 | 22 |
| Data Display | 12 | 0 | 12 |
| Navigation | 12 | 0 | 12 |
| Feedback | 8 | 0 | 8 |
| Layout | 7 | 0 | 7 |
| 记账业务 | 23 | 0 | 23 |
| 其他 | 13 | 2 | 11 |
| **总计** | **113** | **3** | **110** |

---

## 基础组件 (shadcn 风格)

### Button 系列 (16)

| 组件名 | ID | 状态 | 备注 |
|--------|----|----|------|
| Button/Default | `VSnC2` | ✅ 已实现 | 代码支持 variant |
| Button/Secondary | `e8v1X` | ✅ 已实现 | variant="secondary" |
| Button/Destructive | `YKnjc` | ✅ 已实现 | variant="destructive" |
| Button/Outline | `C10zH` | ✅ 已实现 | variant="outline" |
| Button/Ghost | `3f2VW` | ✅ 已实现 | variant="ghost" |
| Button/Large/Default | `C3KOZ` | ✅ 已实现 | size="lg" |
| Button/Large/Secondary | `gou6u` | ✅ 已实现 | size="lg" variant="secondary" |
| Button/Large/Destructive | `xPENL` | ✅ 已实现 | size="lg" variant="destructive" |
| Button/Large/Outline | `ghKmL` | ✅ 已实现 | size="lg" variant="outline" |
| Button/Large/Ghost | `l7zpS` | ✅ 已实现 | size="lg" variant="ghost" |
| Icon Button/Default | `urnwK` | ⚠️ 部分 | 需 size="icon" |
| Icon Button/Secondary | `PbuYK` | ⚠️ 部分 | |
| Icon Button/Destructive | `EsgLk` | ⚠️ 部分 | |
| Icon Button/Outline | `hXOUF` | ⚠️ 部分 | |
| Icon Button/Large/Default | `ZIV1t` | ⚠️ 部分 | |
| Icon Button/Large/Secondary | `AWqtD` | ⚠️ 部分 | |

### 表单组件 (22)

| 组件名 | ID | 状态 |
|--------|----|------|
| Input Group/Default | `1415a` | ❌ 待实现 |
| Input Group/Filled | `uHFal` | ❌ 待实现 |
| Input/Default | `fEUdI` | ❌ 待实现 |
| Input/Filled | `AfQIN` | ❌ 待实现 |
| Select Group/Default | `w5c1O` | ❌ 待实现 |
| Select Group/Filled | `A4VOm` | ❌ 待实现 |
| Combobox/Default | `cCfrk` | ❌ 待实现 |
| Textarea Group/Default | `BjRan` | ❌ 待实现 |
| Textarea Group/Filled | `CrS3L` | ❌ 待实现 |
| Input OTP Group/Default | `02npo` | ❌ 待实现 |
| Input OTP Group/Filled | `rxp3e` | ❌ 待实现 |
| Checkbox/Checked | `ovuDP` | ❌ 待实现 |
| Checkbox/Unchecked | `J7Uph` | ❌ 待实现 |
| Switch/Checked | `c8fiq` | ❌ 待实现 |
| Switch/Unchecked | `fcMl6` | ❌ 待实现 |
| Radio/Selected | `LbK20` | ❌ 待实现 |
| Radio/Unselected | `D9Y8K` | ❌ 待实现 |

### 数据展示 (12)

| 组件名 | ID | 状态 |
|--------|----|------|
| Avatar/Text | `DpPVg` | ❌ 待实现 |
| Avatar/Image | `HWTb9` | ❌ 待实现 |
| Badge/Default | `UjXug` | ❌ 待实现 |
| Badge/Secondary | `WuUMk` | ❌ 待实现 |
| Badge/Destructive | `YvyLD` | ❌ 待实现 |
| Badge/Outline | `3IiAS` | ❌ 待实现 |
| Progress | `hahxH` | ❌ 待实现 |
| Tooltip | `lxrnE` | ❌ 待实现 |
| Table | `bG7YL` | ❌ 待实现 |
| Table Row | `LoAux` | ❌ 待实现 |
| Table Cell | `FulCp` | ❌ 待实现 |
| Data Table | `shadcnDataTable` | ❌ 待实现 |

### 导航组件 (12)

| 组件名 | ID | 状态 |
|--------|----|------|
| Tabs | `PbofX` | ❌ 待实现 |
| Tab Item/Active | `coMmv` | ❌ 待实现 |
| Tab Item/Inactive | `QY0Ka` | ❌ 待实现 |
| Sidebar | `PV1ln` | ❌ 待实现 |
| Sidebar Section Title | `24cM4` | ❌ 待实现 |
| Sidebar Item/Active | `qCCo8` | ❌ 待实现 |
| Sidebar Item/Default | `jBcUh` | ❌ 待实现 |
| Breadcrumb Item/Current | `FBqua` | ❌ 待实现 |
| Breadcrumb Item/Default | `KUk4t` | ❌ 待实现 |
| Breadcrumb Item/Ellipsis | `ctKFD` | ❌ 待实现 |
| Pagination | `U5noB` | ❌ 待实现 |
| Pagination Item/Active | `tjjQe` | ❌ 待实现 |

### 反馈组件 (8)

| 组件名 | ID | 状态 |
|--------|----|------|
| Dialog | `OtykB` | ❌ 待实现 |
| Modal/Left | `oVUJY` | ❌ 待实现 |
| Modal/Center | `X6bmd` | ❌ 待实现 |
| Modal/Icon | `TfbzN` | ❌ 待实现 |
| Alert/Default | `QyzNg` | ❌ 待实现 |
| Alert/Destructive | `K53jF` | ❌ 待实现 |
| Dropdown | `cTN8T` | ❌ 待实现 |
| Accordion/Open | `pfIN1` | ❌ 待实现 |

### 布局组件 (7)

| 组件名 | ID | 状态 |
|--------|----|------|
| Card | `pcGlv` | ❌ 待实现 |
| Card Action | `PiMGI` | ❌ 待实现 |
| Card Plain | `fpgbn` | ❌ 待实现 |
| Card Image | `JENPq` | ❌ 待实现 |
| List Divider | `D24KC` | ❌ 待实现 |
| List Title | `j3KBf` | ❌ 待实现 |
| List Item/Checked | `2JGXl` | ❌ 待实现 |

---

## 记账业务组件 (23)

### 交易相关

| 组件名 | ID | 描述 |
|--------|----|------|
| Transaction Item/Expense | `7J09L` | 支出交易项 |
| Transaction Item/Income | `DP2Ue` | 收入交易项 |
| Transaction Item/Transfer | `1510l` | 转账交易项 |
| Date Header | `SnqPS` | 日期分组头 |

### 统计卡片

| 组件名 | ID | 描述 |
|--------|----|------|
| Stats Card/Income | `BsE8O` | 收入统计卡 |
| Stats Card/Expense | `gLulV` | 支出统计卡 |
| Stats Card/Balance | `ESh6q` | 余额统计卡 |
| Account Card | `HfngO` | 账户卡片 |
| Budget Progress | `3g4JG` | 预算进度 |

### 分类相关

| 组件名 | ID | 描述 |
|--------|----|------|
| Category Item | `lQO3Z` | 分类图标项 |
| Category Item/Selected | `SyFiy` | 选中状态 |
| Category Item/Income | `BQF8n` | 收入分类 |
| Category List Item | `qQdzs` | 分类列表项 |
| Category Suggested Item | `EF6W0` | 建议分类项 |

### 金额显示

| 组件名 | ID | 描述 |
|--------|----|------|
| Amount Display/Expense | `5IIpc` | 支出金额 |
| Amount Display/Income | `4coQE` | 收入金额 |

### 导航组件

| 组件名 | ID | 描述 |
|--------|----|------|
| Tab Bar | `g7O48` | 底部导航栏 |
| Tab Item/Active | `0avou` | 激活标签 |
| Tab Item/Default | `gU6jt` | 默认标签 |
| FAB/Default | `Kg8kE` | 浮动按钮 |
| FAB/Small | `qUihA` | 小浮动按钮 |

### 其他

| 组件名 | ID | 描述 |
|--------|----|------|
| Segment Control | `KhqL4` | 分段控制器 |
| Segment/Active | `mYKTN` | 激活分段 |
| Segment/Inactive | `nh1SI` | 非激活分段 |
| Section Title | `smqMZ` | 分区标题 |
| Empty State | `MCgdN` | 空状态 |

---

## 已实现组件详情

### 1. Button (`packages/component/src/button.tsx`)

**Variants:**
- `default` - 主要按钮
- `secondary` - 次要按钮
- `destructive` - 危险按钮
- `outline` - 轮廓按钮
- `ghost` - 幽灵按钮
- `link` - 链接按钮

**Sizes:**
- `default` - 标准尺寸
- `sm` - 小尺寸
- `lg` - 大尺寸
- `icon` - 图标按钮

### 2. Text (`packages/component/src/text.tsx`)

通用文本组件，支持 NativeWind 样式。

### 3. Icon (`packages/component/src/icon.tsx`)

图标组件，基于 lucide-react-native。

---

## 实施优先级建议

### Phase 1: 核心表单组件
1. Input / Input Group
2. Checkbox
3. Switch
4. Radio

### Phase 2: 数据展示
5. Avatar
6. Badge
7. Card
8. Progress

### Phase 3: 导航组件
9. Tabs
10. Segment Control
11. Tab Bar (业务)

### Phase 4: 反馈组件
12. Dialog / Modal
13. Alert
14. Dropdown
15. Tooltip

### Phase 5: 记账业务组件
16. Transaction Item
17. Stats Card
18. Category Item
19. Amount Display
20. FAB
21. Empty State

---

## 组件设计规范

### 命名规则 (设计文件)
- 基础组件: `Category/Variant` (如 `Button/Default`)
- 状态变体: `Category/State` (如 `Switch/Checked`)
- 业务组件: `Feature Component` (如 `Transaction Item`)

### 代码组织建议
```
packages/component/src/
├── primitives/          # 基础图元 (基于 @rn-primitives)
├── ui/                  # shadcn 风格组件
│   ├── button.tsx
│   ├── input.tsx
│   ├── checkbox.tsx
│   └── ...
├── business/            # 记账业务组件
│   ├── transaction-item.tsx
│   ├── stats-card.tsx
│   └── ...
└── index.ts
```
