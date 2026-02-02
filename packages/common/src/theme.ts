/**
 * Theme colors in pure HSL values (without hsl() function)
 * These values should be kept in sync with global.css
 *
 * NativeWind v4: CSS 变量存储纯 HSL 数值（如 "0 0% 100%"）
 * 在 app-provider.tsx 中通过 vars() 注入时会被 NativeWind 处理
 *
 * 参考: https://github.com/founded-labs/react-native-reusables
 */
export const THEME = {
  light: {
    // 基础语义色 - synced with global.css
    background: '0 0% 100%',
    foreground: '0 0% 4%',
    card: '0 0% 100%',
    cardForeground: '0 0% 4%',
    popover: '0 0% 100%',
    popoverForeground: '0 0% 4%',
    primary: '0 0% 9%',
    primaryForeground: '0 0% 98%',
    secondary: '0 0% 96%',
    secondaryForeground: '0 0% 9%',
    muted: '0 0% 96%',
    mutedForeground: '0 0% 45%',
    accent: '0 0% 96%',
    accentForeground: '0 0% 9%',
    destructive: '0 84% 50%',
    destructiveForeground: '0 0% 100%',
    border: '0 0% 90%',
    input: '0 0% 90%',
    ring: '0 0% 4%',
    // 业务色
    expense: '0 84% 50%',
    expenseForeground: '0 0% 100%',
    expenseMuted: '0 93% 94%',
    income: '142 76% 36%',
    incomeForeground: '0 0% 100%',
    incomeMuted: '141 79% 85%',
    transfer: '217 91% 60%',
    transferForeground: '0 0% 100%',
    transferMuted: '214 95% 93%',
    // 基础色
    black: '0 0% 0%',
    white: '0 0% 100%',
    // 图表色
    chart1: '12 76% 61%',
    chart2: '173 58% 39%',
    chart3: '197 37% 24%',
    chart4: '43 74% 66%',
    chart5: '27 87% 67%',
  },
  dark: {
    // 基础语义色 - synced with global.css
    background: '0 0% 4%',
    foreground: '0 0% 98%',
    card: '0 0% 9%',
    cardForeground: '0 0% 98%',
    popover: '0 0% 9%',
    popoverForeground: '0 0% 98%',
    primary: '0 0% 98%',
    primaryForeground: '0 0% 9%',
    secondary: '0 0% 15%',
    secondaryForeground: '0 0% 98%',
    muted: '0 0% 15%',
    mutedForeground: '0 0% 64%',
    accent: '0 0% 15%',
    accentForeground: '0 0% 98%',
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    border: '0 0% 15%',
    input: '0 0% 15%',
    ring: '0 0% 98%',
    // 业务色
    expense: '0 84% 60%',
    expenseForeground: '0 62% 11%',
    expenseMuted: '0 63% 31%',
    income: '142 71% 45%',
    incomeForeground: '145 80% 10%',
    incomeMuted: '143 64% 24%',
    transfer: '217 91% 60%',
    transferForeground: '224 64% 21%',
    transferMuted: '224 76% 33%',
    // 基础色
    black: '0 0% 0%',
    white: '0 0% 100%',
    // 图表色
    chart1: '220 70% 50%',
    chart2: '160 60% 45%',
    chart3: '30 80% 55%',
    chart4: '280 65% 60%',
    chart5: '340 75% 55%',
  },
};
