import { useTheme } from 'tamagui';

/**
 * Returns current theme colors from Tamagui.
 *
 * Tamagui v2: 使用 useTheme() 获取当前主题的颜色值
 * 返回的颜色值可直接用于 style 属性
 */
export function useThemeColors() {
  const theme = useTheme();

  return {
    // 基础语义色
    background: theme.background?.val ?? '#ffffff',
    foreground: theme.foreground?.val ?? '#0a0a0a',
    card: theme.card?.val ?? '#ffffff',
    cardForeground: theme.cardForeground?.val ?? '#0a0a0a',
    popover: theme.popover?.val ?? '#ffffff',
    popoverForeground: theme.popoverForeground?.val ?? '#0a0a0a',
    primary: theme.primary?.val ?? '#171717',
    primaryForeground: theme.primaryForeground?.val ?? '#fafafa',
    secondary: theme.secondary?.val ?? '#f5f5f5',
    secondaryForeground: theme.secondaryForeground?.val ?? '#171717',
    muted: theme.muted?.val ?? '#f5f5f5',
    mutedForeground: theme.mutedForeground?.val ?? '#737373',
    accent: theme.accent?.val ?? '#f5f5f5',
    accentForeground: theme.accentForeground?.val ?? '#171717',
    destructive: theme.destructive?.val ?? '#dc2626',
    destructiveForeground: theme.destructiveForeground?.val ?? '#ffffff',
    border: theme.border?.val ?? '#e5e5e5',
    input: theme.input?.val ?? '#e5e5e5',
    ring: theme.ring?.val ?? '#0a0a0a',

    // 业务色 - 支出
    expense: theme.expense?.val ?? '#dc2626',
    expenseForeground: theme.expenseForeground?.val ?? '#ffffff',
    expenseMuted: theme.expenseMuted?.val ?? '#fee2e2',

    // 业务色 - 收入
    income: theme.income?.val ?? '#16a34a',
    incomeForeground: theme.incomeForeground?.val ?? '#ffffff',
    incomeMuted: theme.incomeMuted?.val ?? '#dcfce7',

    // 业务色 - 转账
    transfer: theme.transfer?.val ?? '#2563eb',
    transferForeground: theme.transferForeground?.val ?? '#ffffff',
    transferMuted: theme.transferMuted?.val ?? '#dbeafe',

    // 基础色
    black: '#000000',
    white: '#ffffff',

    // 是否暗色主题
    isDark: theme.background?.val === '#0a0a0a',
  };
}
