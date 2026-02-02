import * as React from 'react';
import { View, Pressable, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { ChevronDown } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

// Period Button component
export interface PeriodButtonProps {
  period: string;
  onPress?: () => void;
}

function PeriodButton({ period, onPress }: PeriodButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: 6,
        backgroundColor: colors.muted,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      <Text variant="labelMedium">{period}</Text>
      <Icon as={ChevronDown} size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

// Summary Section component
export interface SummarySectionProps extends Omit<ViewProps, 'style'> {
  period: string;
  totalAmount: string;
  currencySymbol?: string;
  totalLabel?: string;
  onPeriodPress?: () => void;
  style?: ViewStyle;
}

function SummarySection({
  period,
  totalAmount,
  currencySymbol = '¥',
  totalLabel = 'Spent',
  onPeriodPress,
  style,
  ...props
}: SummarySectionProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: 8,
        },
        style,
      ]}
      {...props}
    >
      {/* Period Selector Row - aligned with design: gap-1 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Text variant="labelMedium" color={colors.mutedForeground}>
          {totalLabel}
        </Text>
        <PeriodButton period={period} onPress={onPeriodPress} />
      </View>

      {/* Amount Display - aligned with design */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
        <Text variant="amountCurrency">{currencySymbol}</Text>
        <Text variant="amountLg">{totalAmount}</Text>
      </View>
    </View>
  );
}

export { SummarySection, PeriodButton };
