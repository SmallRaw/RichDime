import * as React from 'react';
import { View, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import type { LucideIcon } from 'lucide-react-native';

export type TransactionVariant = 'expense' | 'income' | 'transfer';

export interface TransactionItemProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: LucideIcon;
  categoryName: string;
  note?: string;
  amount: string;
  account?: string;
  variant?: TransactionVariant;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
  /** @deprecated Use style instead */
  iconContainerClassName?: string;
  /** @deprecated Use style instead */
  iconClassName?: string;
}

function TransactionItem({
  variant = 'expense',
  icon,
  categoryName,
  note,
  amount,
  account,
  style,
  ...props
}: TransactionItemProps) {
  const colors = useThemeColors();

  // Get variant-specific styles
  const getIconContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      height: 40,
      width: 40,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    };

    switch (variant) {
      case 'expense':
        return { ...baseStyle, backgroundColor: colors.muted };
      case 'income':
        return { ...baseStyle, backgroundColor: colors.incomeMuted };
      case 'transfer':
        return { ...baseStyle, backgroundColor: colors.muted };
      default:
        return baseStyle;
    }
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'expense':
        return colors.mutedForeground;
      case 'income':
        return colors.income;
      case 'transfer':
        return colors.mutedForeground;
      default:
        return colors.mutedForeground;
    }
  };

  const getAmountColor = (): string => {
    switch (variant) {
      case 'expense':
        return colors.foreground;
      case 'income':
        return colors.income;
      case 'transfer':
        return colors.mutedForeground;
      default:
        return colors.foreground;
    }
  };

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
        },
        style,
      ]}
      {...props}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View style={getIconContainerStyle()}>
          <Icon as={icon} size={20} color={getIconColor()} />
        </View>
        <View style={{ gap: 2 }}>
          <Text variant="subtitle">{categoryName}</Text>
          {note && <Text variant="caption">{note}</Text>}
        </View>
      </View>
      <View style={{ alignItems: 'flex-end', gap: 2 }}>
        <Text variant="title" color={getAmountColor()}>
          {amount}
        </Text>
        {account && <Text variant="caption">{account}</Text>}
      </View>
    </Pressable>
  );
}

export { TransactionItem };
