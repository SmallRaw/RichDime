import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export type AmountDisplayVariant = 'expense' | 'income' | 'neutral';
export type AmountDisplaySize = 'default' | 'lg';

export interface AmountDisplayProps extends Omit<ViewProps, 'style'> {
  currency?: string;
  value: string;
  decimal?: string;
  variant?: AmountDisplayVariant;
  size?: AmountDisplaySize;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function AmountDisplay({
  variant = 'expense',
  size = 'default',
  currency = '¥',
  value,
  decimal,
  style,
  ...props
}: AmountDisplayProps) {
  const colors = useThemeColors();

  // Get color based on variant
  const getColor = (): string => {
    switch (variant) {
      case 'expense':
        return colors.expense;
      case 'income':
        return colors.income;
      case 'neutral':
        return colors.foreground;
      default:
        return colors.foreground;
    }
  };

  const color = getColor();

  // Size-based styles
  const currencyVariant = size === 'lg' ? 'amountCurrency' : 'title';
  const valueVariant = size === 'lg' ? 'amountLg' : 'amount';
  const decimalVariant = size === 'lg' ? 'amountDecimal' : 'body';

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 4,
        },
        style,
      ]}
      {...props}
    >
      <Text variant={currencyVariant} color={color}>
        {currency}
      </Text>
      <Text variant={valueVariant} color={color}>
        {value}
      </Text>
      {decimal && (
        <Text variant={decimalVariant} color={color}>
          {decimal}
        </Text>
      )}
    </View>
  );
}

export { AmountDisplay };
