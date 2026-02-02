# NativeWind Monorepo 配置指南

## 问题

在 pnpm monorepo 中，workspace 包内的 `View` 组件使用 `className` 无效，样式不生效。

## 根本原因

NativeWind v4 依赖 Babel 转换（`jsxImportSource: 'nativewind'`）来处理 `className` 属性。每个 workspace 包都需要自己的 `babel.config.js` 才能正确应用转换。

## 解决方案

在每个使用 NativeWind 样式的 workspace 包中添加 `babel.config.js`：

```javascript
// packages/your-package/babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      'nativewind/babel',
    ],
  };
};
```

## 检查清单

1. **主应用配置** (`apps/mobile/`)
   - [x] `babel.config.js` - NativeWind presets
   - [x] `metro.config.js` - `withNativeWind` 包装
   - [x] `tailwind.config.js` - content 包含 workspace 包路径
   - [x] `global.css` - Tailwind 指令

2. **Workspace 包配置** (如 `packages/kit/`)
   - [x] `babel.config.js` - 与主应用相同的 NativeWind presets

## 验证方法

```tsx
// 如果这段代码正确显示为水平布局，说明配置正确
<View className="flex-row justify-between">
  <Text>Left</Text>
  <Text>Right</Text>
</View>
```

## 参考链接

- [Expo Monorepos Guide](https://docs.expo.dev/guides/monorepos/)
- [NativeWind Monorepo Guide](https://www.nativewind.dev/docs/guides/using-with-monorepos)
