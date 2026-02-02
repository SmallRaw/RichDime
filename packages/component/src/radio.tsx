import * as React from 'react';
import { Pressable, View, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface RadioProps {
  selected?: boolean;
  onSelect?: () => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

function Radio({
  selected = false,
  onSelect,
  label,
  disabled = false,
  style,
}: RadioProps) {
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
      onPress={() => !disabled && onSelect?.()}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
    >
      <View
        style={{
          height: 16,
          width: 16,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 9999,
          borderWidth: 1,
          borderColor: selected ? colors.primary : colors.input,
        }}
      >
        {selected && (
          <View
            style={{
              height: 8,
              width: 8,
              borderRadius: 9999,
              backgroundColor: colors.primary,
            }}
          />
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

export interface RadioGroupProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  style?: ViewStyle;
}

function RadioGroup({
  value,
  onValueChange,
  children,
  style,
}: RadioGroupProps) {
  return (
    <View style={[{ gap: 8 }, style]} role="radiogroup">
      {React.Children.map(children, (child) => {
        if (React.isValidElement<RadioItemProps>(child)) {
          return React.cloneElement(child, {
            selected: child.props.value === value,
            onSelect: () => onValueChange?.(child.props.value),
          });
        }
        return child;
      })}
    </View>
  );
}

export interface RadioItemProps extends Omit<RadioProps, 'selected' | 'onSelect'> {
  value: string;
  selected?: boolean;
  onSelect?: () => void;
}

function RadioItem({ value, ...props }: RadioItemProps) {
  return <Radio {...props} />;
}

export { Radio, RadioGroup, RadioItem };
