# Rich-Dime 项目架构

## 概述

pnpm workspace monorepo 架构的 Expo 多平台记账应用（iOS/Android/Web）。

## 目录结构

```
rich-dime/
├── apps/mobile/          # Expo App 入口
├── packages/
│   ├── kit/              # 核心业务层（screens、hooks、store）
│   ├── component/        # UI 组件库（50+ 组件）
│   ├── database/         # 数据层（Drizzle ORM + SQLite）
│   ├── adapters/         # 平台适配层（.native.ts / .web.ts）
│   └── common/           # 通用工具（cn、theme）
└── demo/                 # 旧版演示（暂不使用）
```

## 技术栈

| 层级 | 技术 | 版本 |
|------|------|------|
| 路由 | Expo Router | 6.0 |
| 运行时 | React + React Native | 19 + 0.81 |
| 样式 | Tailwind + NativeWind | 3.4 + 4.2 |
| 状态 | Zustand + Jotai + React Query | 5 + 2 + 5 |
| 数据库 | Drizzle ORM + expo-sqlite | 0.45 + 15.2 |
| 打包 | Metro | - |

## 包依赖关系

```
mobile → kit → component → common
              → database
              → adapters → common
```

## 状态管理分工

- **Zustand** (`kit/src/store/transaction-draft.ts`)：记账流程临时状态
- **Jotai** (`kit/src/store/atoms.ts`)：统计/交易筛选的持久化 UI 状态
- **React Query**：数据库查询缓存（categories、transactions 等）

## 样式系统

Design Tokens 定义在 `apps/mobile/global.css`：

```css
:root {
  /* 颜色 */
  --background, --foreground, --expense, --income, --transfer
  /* 间距 */
  --spacing-1 ~ --spacing-8
  /* 圆角 */
  --radius-sm, --radius-md, --radius-lg
}
```

组件使用 Tailwind 类名：`className="text-foreground bg-background"`

## 平台适配

`packages/adapters/` 通过文件后缀自动选择实现：

| 功能 | Native | Web |
|------|--------|-----|
| Storage | AsyncStorage | localStorage |
| Clipboard | RN Clipboard | Web API |
| Theme | useColorScheme | mediaQuery |

## 关键文件

| 文件 | 作用 |
|------|------|
| `apps/mobile/metro.config.js` | Monorepo 路径映射、NativeWind |
| `apps/mobile/babel.config.js` | JSX + import.meta 兼容 |
| `apps/mobile/global.css` | Design Tokens |
| `apps/mobile/app/_layout.tsx` | 根布局、AppProvider |
| `packages/kit/src/providers/app-provider.tsx` | React Query + 主题 |
| `packages/database/src/connection.ts` | 数据库连接管理 |
| `packages/database/src/schema/tables.ts` | 表定义（8张表） |

## 数据库表

- `accounts` - 账户
- `categories` - 分类（支持父子关系）
- `transactions` - 交易记录
- `recurring_transactions` - 循环交易
- `budgets` - 预算
- `tags`, `attachments`, `schema_version`

## 路由结构

```
apps/mobile/app/
├── _layout.tsx           # 根布局
├── index.tsx             # 首页
├── (tabs)/               # 标签页组
│   ├── index.tsx         # 主页
│   ├── add.tsx           # 添加交易
│   └── statistics.tsx    # 统计
├── add-transaction.tsx   # 模态
├── category-picker.tsx   # 模态
├── edit-categories.tsx   # 模态
├── settings.tsx          # 设置
└── storybook.tsx         # Storybook 入口
```

## 开发命令

```bash
pnpm dev        # Expo dev server
pnpm ios        # iOS 模拟器
pnpm android    # Android 模拟器
pnpm web        # Web 浏览器
pnpm storybook  # Storybook on-device
```

## 已知问题与解决方案

1. **NativeWind 在 workspace packages 不工作** → metro.config.js 添加 resolver 路径
2. **Metro 卡 99%** → 避免循环依赖，分离存储导入
3. **Jotai import.meta.env 报错** → babel-plugin-transform-import-meta
4. **expo-sqlite Web 需要 SharedArrayBuffer** → 设置 COOP/COEP 头
5. **NativeWind 样式修改后热重载不生效** → 完全重启 Expo Go 验证（见下方说明）

### NativeWind 热重载问题

修改 NativeWind className 样式后，Metro 热重载经常不生效，导致看不到样式变化。这是 [NativeWind 已知问题](https://github.com/nativewind/nativewind/issues/924)。

**验证样式变更的正确方式：**

```bash
# 方法1：命令行重启 Expo Go
xcrun simctl terminate booted host.exp.Exponent
xcrun simctl launch booted host.exp.Exponent --url "exp://127.0.0.1:8081"

# 方法2：手动操作
# 在 iOS 模拟器中上滑关闭 Expo Go，然后重新打开
```

**注意：** 普通的热重载（保存文件自动刷新）对 NativeWind 样式变更不可靠，必须完全重启 app。

## 代码规范

- 优先使用 Design Token，禁止硬编码颜色/间距
- 优先使用现有组件，避免重复造轮子
- 相似 UI 必须抽象为通用组件
- UI 变更必须通过 `/pencil-code` skill 验证
