import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface DateHeaderProps extends Omit<ViewProps, 'style'> {
  date: string;
  weekday?: string;
  totalAmount?: string;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
  /** @deprecated Use style instead */
  totalAmountClassName?: string;
}

function DateHeader({
  date,
  weekday,
  totalAmount,
  style,
  ...props
}: DateHeaderProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        style,
      ]}
      {...props}
    >
      {/* Left Section */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Text variant="label">{date}</Text>
        {weekday && <Text variant="secondary">{weekday}</Text>}
      </View>

      {/* Day Total */}
      {totalAmount && (
        <Text
          variant="label"
          color={totalAmount.startsWith('-') ? colors.expense : totalAmount.startsWith('+') ? colors.income : colors.mutedForeground}
        >
          {totalAmount}
        </Text>
      )}
    </View>
  );
}

export { DateHeader };
