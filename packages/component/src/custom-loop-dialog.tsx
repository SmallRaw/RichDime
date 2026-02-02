import * as React from 'react';
import { View, Pressable, Animated, TextInput } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export type LoopUnit = 'day' | 'week' | 'month' | 'year';

export interface CustomLoopDialogProps {
  visible: boolean;
  onConfirm: (interval: number, unit: LoopUnit) => void;
  onClose: () => void;
}

const UNIT_OPTIONS: { value: LoopUnit; label: string }[] = [
  { value: 'day', label: '天' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
  { value: 'year', label: '年' },
];

function CustomLoopDialog({
  visible,
  onConfirm,
  onClose,
}: CustomLoopDialogProps) {
  const colors = useThemeColors();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const [interval, setInterval] = React.useState('1');
  const [unit, setUnit] = React.useState<LoopUnit>('month');

  React.useEffect(() => {
    if (visible) {
      setInterval('1');
      setUnit('month');
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

  const handleConfirm = () => {
    const num = parseInt(interval, 10);
    if (num > 0) {
      onConfirm(num, unit);
    }
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: fadeAnim,
        justifyContent: 'center',
        alignItems: 'center',
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

      {/* Dialog */}
      <View
        style={{
          width: 280,
          borderRadius: 12,
          backgroundColor: colors.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          elevation: 5,
        }}
      >
        {/* Title */}
        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: 'NotoSansSC_500Medium',
            }}
            color={colors.foreground}
          >
            自定义循环
          </Text>
        </View>

        {/* Content */}
        <View style={{ gap: 16, padding: 16 }}>
          {/* Interval Row: 每 [input] [unit] 循环一次 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14 }} color={colors.foreground}>
              每
            </Text>
            <TextInput
              style={{
                height: 36,
                width: 56,
                borderRadius: 6,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.background,
                paddingHorizontal: 8,
                textAlign: 'center',
                fontSize: 14,
                color: colors.foreground,
              }}
              value={interval}
              onChangeText={(text) => {
                const filtered = text.replace(/[^0-9]/g, '');
                if (filtered.length <= 3) {
                  setInterval(filtered);
                }
              }}
              keyboardType="number-pad"
              maxLength={3}
            />
            {/* Unit Selector */}
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {UNIT_OPTIONS.map((opt) => {
                const isSelected = unit === opt.value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setUnit(opt.value)}
                    style={{
                      borderRadius: 6,
                      paddingHorizontal: 12,
                      paddingVertical: 6,
                      backgroundColor: isSelected ? colors.primary : colors.muted,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: isSelected ? 'NotoSansSC_500Medium' : 'NotoSansSC_400Regular',
                      }}
                      color={isSelected ? colors.primaryForeground : colors.mutedForeground}
                    >
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
          <Text style={{ fontSize: 12 }} color={colors.mutedForeground}>
            循环一次
          </Text>
        </View>

        {/* Footer */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            gap: 8,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingHorizontal: 16,
            paddingVertical: 12,
          }}
        >
          <Pressable
            onPress={onClose}
            style={{
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text style={{ fontSize: 14 }} color={colors.mutedForeground}>
              取消
            </Text>
          </Pressable>
          <Pressable
            onPress={handleConfirm}
            style={{
              borderRadius: 8,
              backgroundColor: colors.primary,
              paddingHorizontal: 16,
              paddingVertical: 8,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'NotoSansSC_500Medium',
              }}
              color={colors.primaryForeground}
            >
              确定
            </Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

export { CustomLoopDialog };
