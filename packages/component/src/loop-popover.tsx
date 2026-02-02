import * as React from 'react';
import { View, Pressable, Animated } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export type LoopValue = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface LoopPopoverProps {
  visible: boolean;
  selectedValue: LoopValue;
  onSelect: (value: LoopValue) => void;
  onClose: () => void;
}

const LOOP_OPTIONS: { value: LoopValue; label: string }[] = [
  { value: 'none', label: '无' },
  { value: 'daily', label: '每天' },
  { value: 'weekly', label: '每周' },
  { value: 'monthly', label: '每月' },
  { value: 'yearly', label: '每年' },
  { value: 'custom', label: '自定义...' },
];

function LoopPopover({
  visible,
  selectedValue,
  onSelect,
  onClose,
}: LoopPopoverProps) {
  const colors = useThemeColors();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: fadeAnim,
      }}
    >
      {/* Overlay */}
      <Pressable
        onPress={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.25)',
        }}
      />

      {/* Popover - positioned at top-right below header */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          top: 56,
          width: 200,
          borderRadius: 8,
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        <View style={{ padding: 8 }}>
          {LOOP_OPTIONS.map((option) => {
            const isSelected = selectedValue === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => onSelect(option.value)}
                style={{
                  borderRadius: 2,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  backgroundColor: isSelected ? colors.primary : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontFamily: isSelected ? 'NotoSansSC_500Medium' : 'NotoSansSC_400Regular',
                  }}
                  color={isSelected ? colors.primaryForeground : colors.foreground}
                >
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </Animated.View>
  );
}

export { LoopPopover };
