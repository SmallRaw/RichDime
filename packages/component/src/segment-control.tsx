import * as React from 'react';
import { View, Pressable, Platform, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface SegmentOption {
  value: string;
  label: string;
}

export interface SegmentControlProps extends Omit<ViewProps, 'style'> {
  options: SegmentOption[];
  value: string;
  onValueChange: (value: string) => void;
  style?: ViewStyle;
}

function SegmentControl({
  options,
  value,
  onValueChange,
  style,
  ...props
}: SegmentControlProps) {
  const colors = useThemeColors();

  const getShadowStyle = (isActive: boolean) => {
    if (!isActive) return {};
    if (Platform.OS === 'ios') {
      return {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      };
    }
    if (Platform.OS === 'android') {
      return { elevation: 2 };
    }
    return {};
  };

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 9999,
          backgroundColor: colors.muted,
          padding: 4,
        },
        style,
      ]}
      {...props}
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <Pressable
            key={option.value}
            onPress={() => onValueChange(option.value)}
            style={[
              {
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 9999,
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: isActive ? colors.background : 'transparent',
              },
              getShadowStyle(isActive),
            ]}
          >
            <Text
              variant="labelMedium"
              color={isActive ? colors.foreground : colors.mutedForeground}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { SegmentControl };
