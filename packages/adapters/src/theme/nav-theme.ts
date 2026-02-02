import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import { THEME } from '@rich-dime/common';

// Helper to wrap HSL values with hsl() function
function hsl(value: string): string {
  return `hsl(${value})`;
}

/**
 * Navigation theme colors for @react-navigation
 *
 * NativeWind v4: THEME 存储纯 HSL 数值（如 "0 0% 100%"）
 * 需要用 hsl() 包装才能作为有效颜色值使用
 *
 * 参考: https://github.com/founded-labs/react-native-reusables
 */
export const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: hsl(THEME.light.background),
      border: hsl(THEME.light.border),
      card: hsl(THEME.light.card),
      notification: hsl(THEME.light.destructive),
      primary: hsl(THEME.light.primary),
      text: hsl(THEME.light.foreground),
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: hsl(THEME.dark.background),
      border: hsl(THEME.dark.border),
      card: hsl(THEME.dark.card),
      notification: hsl(THEME.dark.destructive),
      primary: hsl(THEME.dark.primary),
      text: hsl(THEME.dark.foreground),
    },
  },
};
