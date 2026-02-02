import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

function Checkbox({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  style,
}: CheckboxProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      role="checkbox"
      aria-checked={checked}
    >
      <View
        style={{
          height: 16,
          width: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 4,
          borderWidth: 1,
          borderColor: checked ? colors.primary : colors.input,
          backgroundColor: checked ? colors.primary : colors.background,
        }}
      >
        {checked && (
          <Text
            style={{ fontSize: 12 }}
            color={colors.primaryForeground}
          >
            ✓
          </Text>
        )}
      </View>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontFamily: 'NotoSansSC_500Medium',
          }}
          color={colors.foreground}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export { Checkbox };
