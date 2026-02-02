import * as React from 'react';
import { View, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'expense'
  | 'income'
  | 'transfer';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

function Badge({ children, variant = 'default', style }: BadgeProps) {
  const colors = useThemeColors();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      case 'destructive':
        return colors.destructive;
      case 'outline':
        return 'transparent';
      case 'expense':
        return colors.expense;
      case 'income':
        return colors.income;
      case 'transfer':
        return colors.transfer;
      default:
        return colors.primary;
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.secondaryForeground;
      case 'destructive':
        return colors.destructiveForeground;
      case 'outline':
        return colors.foreground;
      case 'expense':
        return colors.expenseForeground;
      case 'income':
        return colors.incomeForeground;
      case 'transfer':
        return colors.transferForeground;
      default:
        return colors.primaryForeground;
    }
  };

  const getBorderStyle = (): ViewStyle => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: colors.border,
      };
    }
    return {};
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          paddingHorizontal: 8,
          paddingVertical: 2,
          backgroundColor: getBackgroundColor(),
        },
        getBorderStyle(),
        style,
      ]}
    >
      <Text variant="badge" color={getTextColor()}>
        {children}
      </Text>
    </View>
  );
}

export { Badge };
