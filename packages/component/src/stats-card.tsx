import * as React from 'react';
import { View, type ViewProps, type ViewStyle, Platform } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react-native';

export type StatsCardVariant = 'income' | 'expense' | 'balance';

const ICONS = {
  income: TrendingUp,
  expense: TrendingDown,
  balance: Scale,
};

export interface StatsCardProps extends Omit<ViewProps, 'style'> {
  label: string;
  amount: string;
  change?: string;
  variant?: StatsCardVariant;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function StatsCard({
  variant = 'expense',
  label,
  amount,
  change,
  style,
  ...props
}: StatsCardProps) {
  const colors = useThemeColors();
  const IconComponent = ICONS[variant];

  // Get variant-specific colors
  const getIconContainerColor = (): string => {
    switch (variant) {
      case 'income':
        return colors.incomeMuted;
      case 'expense':
        return colors.expenseMuted;
      case 'balance':
        return colors.muted;
      default:
        return colors.muted;
    }
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'income':
        return colors.income;
      case 'expense':
        return colors.expense;
      case 'balance':
        return colors.mutedForeground;
      default:
        return colors.mutedForeground;
    }
  };

  const getChangeColor = (): string => {
    switch (variant) {
      case 'income':
        return colors.income;
      case 'expense':
        return colors.expense;
      case 'balance':
        return colors.mutedForeground;
      default:
        return colors.mutedForeground;
    }
  };

  return (
    <View
      style={[
        {
          gap: 12,
          borderRadius: 16,
          backgroundColor: colors.card,
          padding: 16,
          ...Platform.select({
            ios: {
              shadowColor: '#000000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 16,
            },
            android: { elevation: 2 },
          }),
        },
        style,
      ]}
      {...props}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{
            height: 32,
            width: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            backgroundColor: getIconContainerColor(),
          }}
        >
          <Icon as={IconComponent} size={16} color={getIconColor()} />
        </View>
        <Text variant="labelMedium" color={colors.mutedForeground}>
          {label}
        </Text>
      </View>

      {/* Amount */}
      <Text variant="amount">{amount}</Text>

      {/* Change */}
      {change && (
        <Text variant="secondary" color={getChangeColor()}>
          {change}
        </Text>
      )}
    </View>
  );
}

export { StatsCard };
