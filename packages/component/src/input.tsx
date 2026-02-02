import * as React from 'react';
import { TextInput, View, type TextInputProps, type ViewStyle, type TextStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

const INPUT_HEIGHT = 44;

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  error?: string;
  style?: TextStyle;
  containerStyle?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, error, placeholderTextColor, style, containerStyle, ...props }, ref) => {
    const colors = useThemeColors();

    return (
      <View style={[{ gap: 8 }, containerStyle]}>
        {label && (
          <Text variant="labelMedium" color={colors.foreground}>
            {label}
          </Text>
        )}
        <TextInput
          ref={ref}
          style={[
            {
              height: INPUT_HEIGHT,
              width: '100%',
              borderRadius: 6,
              borderWidth: 1,
              borderColor: error ? colors.destructive : colors.input,
              backgroundColor: colors.background,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 14,
              color: colors.foreground,
              fontFamily: 'NotoSansSC_400Regular',
            },
            style,
          ]}
          placeholderTextColor={placeholderTextColor ?? colors.mutedForeground}
          {...props}
        />
        {error && (
          <Text variant="caption" color={colors.destructive}>
            {error}
          </Text>
        )}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
