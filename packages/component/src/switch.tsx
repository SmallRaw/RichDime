import * as React from 'react';
import { Pressable, View, Animated, Platform, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

function Switch({
  checked = false,
  onCheckedChange,
  label,
  disabled = false,
  style,
}: SwitchProps) {
  const colors = useThemeColors();
  const translateX = React.useRef(new Animated.Value(checked ? 20 : 0)).current;

  React.useEffect(() => {
    Animated.spring(translateX, {
      toValue: checked ? 20 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [checked, translateX]);

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      onPress={() => !disabled && onCheckedChange?.(!checked)}
      disabled={disabled}
      role="switch"
      aria-checked={checked}
    >
      <View
        style={{
          height: 24,
          width: 44,
          borderRadius: 9999,
          padding: 2,
          backgroundColor: checked ? colors.primary : colors.input,
        }}
      >
        <Animated.View
          style={[
            {
              height: 20,
              width: 20,
              borderRadius: 9999,
              backgroundColor: colors.background,
              transform: [{ translateX }],
            },
            Platform.select({
              ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 5.25,
              },
              android: { elevation: 3 },
            }),
          ]}
        />
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

export { Switch };
