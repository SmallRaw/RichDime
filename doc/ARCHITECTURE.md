# Rich Dime 技术架构文档

## 当前架构概览

```
rich-dime/
├── apps/
│   └── mobile/                    # Expo 移动应用 (主入口)
│       ├── app/                   # expo-router 路由
│       ├── global.css             # 应用层样式 (导入 component/global.css)
│       └── tailwind.config.js     # 继承自 component
├── packages/
│   ├── common/                    # 公共工具层
│   ├── adapters/                  # 平台适配层
│   ├── component/                 # 基础 UI 组件层
│   └── kit/                       # 业务套件层
├── demo/                          # 独立 demo (非 workspace 成员)
└── doc/ui/                        # 设计文件
```

## 包依赖关系

```
                    ┌─────────────────┐
                    │  apps/mobile    │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  @rich-dime/kit │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼───────┐  ┌─────────▼─────────┐  ┌──────▼──────┐
│   /adapters   │  │    /component     │  │   /common   │
└───────┬───────┘  └─────────┬─────────┘  └──────┬──────┘
        │                    │                   │
        └────────────────────┴───────────────────┘
                             │
                    ┌────────▼────────┐
                    │  @rich-dime/    │
                    │     common      │
                    └─────────────────┘
```

## 各包职责

### @rich-dime/common
**最底层公共工具**

当前导出:
- `THEME` - 主题颜色配置 (light/dark)
- `NAV_THEME` - React Navigation 主题

当前依赖:
- `@react-navigation/native`
- `clsx`
- `tailwind-merge`

---

### @rich-dime/adapters
**平台适配层 - 抹平 web/native 差异**

导出模块:
- `storage` - 存储适配 (AsyncStorage / localStorage)
- `clipboard` - 剪贴板适配
- `device` - 设备信息适配
- `theme` - 主题系统适配 (useColorSchemeAdapter)

依赖: `@rich-dime/common`

---

### @rich-dime/component
**基础 UI 组件层**

当前组件:
- `Button` - 按钮 (variants: default/secondary/destructive/outline/ghost/link)
- `Text` - 文本
- `Icon` - 图标

Design Tokens (global.css):
- 颜色变量 (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring)
- 圆角变量 (--radius)
- 图表颜色 (chart-1 ~ chart-5)

依赖: `@rich-dime/common`

---

### @rich-dime/kit
**业务套件层 - 组装业务功能**

模块:
- `/screens` - 页面组件 (Home, Profile, Settings, NotFound)
- `/features` - 功能组件 (Welcome, Profile)
- `/layouts` - 布局组件 (MainLayout, TabLayout)
- `/hooks` - 业务 Hooks (useAuth, useStorage, useTheme)
- `/providers` - Context Providers (AppProvider)
- `/navigation` - 导航工具 (Link, useNavigation)

依赖: `@rich-dime/adapters`, `@rich-dime/common`, `@rich-dime/component`

---

## 发现的架构问题

### 1. cn 函数重复定义
- `common` 包有 `clsx` + `tailwind-merge` 依赖但未导出 `cn`
- `component` 包自己定义了 `cn.ts`
- **建议**: 将 `cn` 移至 `common` 统一导出

### 2. 依赖层次混乱
- `common` 依赖 `@react-navigation/native` (应在更高层)
- Theme 数据同时存在于:
  - `common/theme.ts` (JS 对象形式)
  - `component/global.css` (CSS 变量形式)
- **建议**: 重新规划依赖层次

### 3. demo 项目孤立
- `demo/` 是独立项目，有自己的 `node_modules` 和 `package-lock.json`
- 不在 pnpm-workspace.yaml 中
- **建议**: 移入 workspace 或删除

### 4. Design Tokens 分散
- CSS 变量在 `component/global.css`
- JS 主题在 `common/theme.ts`
- 两者需要手动同步
- **建议**: 建立单一数据源

---

## 推荐架构调整

### 调整后的依赖关系

```
@rich-dime/common     (最底层: 工具函数, 类型定义, 常量)
       ↑
@rich-dime/tokens     (新增: Design Tokens 单一数据源)
       ↑
@rich-dime/adapters   (平台适配)
       ↑
@rich-dime/component  (基础 UI 组件)
       ↑
@rich-dime/kit        (业务套件)
       ↑
apps/mobile           (应用入口)
```

### common 包职责调整
```typescript
// 应该包含
export { cn } from './cn';
export type { ... } from './types';

// 不应该包含
// - @react-navigation/native 依赖
// - THEME/NAV_THEME (移至 tokens 或 adapters)
```

### 新增 tokens 包 (可选)
```
packages/tokens/
├── src/
│   ├── colors.ts      # 颜色定义
│   ├── spacing.ts     # 间距定义
│   ├── typography.ts  # 字体定义
│   └── index.ts       # 统一导出
├── css/
│   └── variables.css  # 生成的 CSS 变量
└── tailwind.preset.js # Tailwind 预设
```

---

## 技术栈

| 分类 | 技术 |
|-----|-----|
| 框架 | React Native + Expo |
| 路由 | expo-router |
| 样式 | NativeWind (TailwindCSS) |
| 组件模式 | CVA (class-variance-authority) |
| 包管理 | pnpm workspace |
| 类型 | TypeScript |

## 设计资源

设计源文件: `doc/ui/pencil-main.pen`

包含 113 个可复用组件，涵盖:
- 基础组件 (Button, Input, Card 等)
- 数据展示 (Table, Avatar, Badge 等)
- 导航组件 (Tabs, Sidebar, Breadcrumb 等)
- 记账业务组件 (Transaction Item, Stats Card 等)
