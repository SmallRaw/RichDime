module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Tamagui 编译优化插件
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
        },
      ],
      // 转换 import.meta.env 为 process.env（解决 jotai 等包在非 ESM 环境的兼容问题）
      [
        'babel-plugin-transform-import-meta',
        {
          importMetaEnvReplacement: 'process.env',
        },
      ],
      // 内联环境变量（支持 Storybook 模式检测）
      ['transform-inline-environment-variables', { include: ['STORYBOOK'] }],
      // React Native Reanimated 插件（必须放在最后）
      'react-native-reanimated/plugin',
    ],
  };
};
