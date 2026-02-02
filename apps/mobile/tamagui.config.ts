import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { createAnimations } from '@tamagui/animations-react-native';

/**
 * HSL 值转换为 hex
 * 输入: "0 0% 100%" (h s% l%)
 * 输出: "#ffffff"
 */
function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map((v, i) => {
    const num = parseFloat(v);
    return i === 0 ? num : num / 100;
  });

  const hue = h;
  const sat = s;
  const lig = l;

  const c = (1 - Math.abs(2 * lig - 1)) * sat;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = lig - c / 2;

  let r = 0, g = 0, b = 0;

  if (hue >= 0 && hue < 60) {
    r = c; g = x; b = 0;
  } else if (hue >= 60 && hue < 120) {
    r = x; g = c; b = 0;
  } else if (hue >= 120 && hue < 180) {
    r = 0; g = c; b = x;
  } else if (hue >= 180 && hue < 240) {
    r = 0; g = x; b = c;
  } else if (hue >= 240 && hue < 300) {
    r = x; g = 0; b = c;
  } else {
    r = c; g = 0; b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 从 THEME 转换的颜色（与 packages/common/src/theme.ts 同步）
const lightColors = {
  background: hslToHex('0 0% 100%'),
  foreground: hslToHex('0 0% 4%'),
  card: hslToHex('0 0% 100%'),
  cardForeground: hslToHex('0 0% 4%'),
  popover: hslToHex('0 0% 100%'),
  popoverForeground: hslToHex('0 0% 4%'),
  primary: hslToHex('0 0% 9%'),
  primaryForeground: hslToHex('0 0% 98%'),
  secondary: hslToHex('0 0% 96%'),
  secondaryForeground: hslToHex('0 0% 9%'),
  muted: hslToHex('0 0% 96%'),
  mutedForeground: hslToHex('0 0% 45%'),
  accent: hslToHex('0 0% 96%'),
  accentForeground: hslToHex('0 0% 9%'),
  destructive: hslToHex('0 84% 50%'),
  destructiveForeground: hslToHex('0 0% 100%'),
  border: hslToHex('0 0% 90%'),
  input: hslToHex('0 0% 90%'),
  ring: hslToHex('0 0% 4%'),
  // 业务色
  expense: hslToHex('0 84% 50%'),
  expenseForeground: hslToHex('0 0% 100%'),
  expenseMuted: hslToHex('0 93% 94%'),
  income: hslToHex('142 76% 36%'),
  incomeForeground: hslToHex('0 0% 100%'),
  incomeMuted: hslToHex('141 79% 85%'),
  transfer: hslToHex('217 91% 60%'),
  transferForeground: hslToHex('0 0% 100%'),
  transferMuted: hslToHex('214 95% 93%'),
};

const darkColors = {
  background: hslToHex('0 0% 4%'),
  foreground: hslToHex('0 0% 98%'),
  card: hslToHex('0 0% 9%'),
  cardForeground: hslToHex('0 0% 98%'),
  popover: hslToHex('0 0% 9%'),
  popoverForeground: hslToHex('0 0% 98%'),
  primary: hslToHex('0 0% 98%'),
  primaryForeground: hslToHex('0 0% 9%'),
  secondary: hslToHex('0 0% 15%'),
  secondaryForeground: hslToHex('0 0% 98%'),
  muted: hslToHex('0 0% 15%'),
  mutedForeground: hslToHex('0 0% 64%'),
  accent: hslToHex('0 0% 15%'),
  accentForeground: hslToHex('0 0% 98%'),
  destructive: hslToHex('0 84% 60%'),
  destructiveForeground: hslToHex('0 0% 100%'),
  border: hslToHex('0 0% 15%'),
  input: hslToHex('0 0% 15%'),
  ring: hslToHex('0 0% 98%'),
  // 业务色
  expense: hslToHex('0 84% 60%'),
  expenseForeground: hslToHex('0 62% 11%'),
  expenseMuted: hslToHex('0 63% 31%'),
  income: hslToHex('142 71% 45%'),
  incomeForeground: hslToHex('145 80% 10%'),
  incomeMuted: hslToHex('143 64% 24%'),
  transfer: hslToHex('217 91% 60%'),
  transferForeground: hslToHex('224 64% 21%'),
  transferMuted: hslToHex('224 76% 33%'),
};

// 动画配置
const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
  medium: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  slow: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
});

// 字体配置 - 使用 Noto Sans SC
const notoSansFont = createInterFont({
  family: 'NotoSansSC_400Regular',
  face: {
    400: { normal: 'NotoSansSC_400Regular' },
    500: { normal: 'NotoSansSC_500Medium' },
    600: { normal: 'NotoSansSC_600SemiBold' },
    700: { normal: 'NotoSansSC_700Bold' },
  },
});

// Tokens
const tokens = createTokens({
  color: {
    ...lightColors,
    // 通用色
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
  space: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 16, // 默认间距
  },
  size: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    true: 44, // 默认尺寸（按钮高度等）
  },
  radius: {
    0: 0,
    1: 4,
    2: 8,
    3: 12,
    4: 16,
    5: 20,
    6: 24,
    true: 8, // 默认圆角
    full: 9999,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
  },
});

// 主题
const lightTheme = {
  ...lightColors,
};

const darkTheme = {
  ...darkColors,
};

export const config = createTamagui({
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  fonts: {
    body: notoSansFont,
    heading: notoSansFont,
  },
  shorthands,
  animations,
  defaultFont: 'body',
  // 媒体查询（Tailwind 风格断点）
  media: {
    xs: { maxWidth: 639 },
    sm: { minWidth: 640 },
    md: { minWidth: 768 },
    lg: { minWidth: 1024 },
    xl: { minWidth: 1280 },
    xxl: { minWidth: 1536 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  },
});

// 类型导出
export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
