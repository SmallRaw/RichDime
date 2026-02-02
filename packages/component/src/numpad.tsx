import * as React from 'react';
import { View, Pressable, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { Check } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

export interface NumpadProps extends Omit<ViewProps, 'style'> {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
  onConfirm: () => void;
  /** Show operator keys (+, −, ×, ÷) as a 4th column. Default: true */
  showOperators?: boolean;
  style?: ViewStyle;
}

// 4-column layout: numbers | operator (right)
const KEYS_WITH_OPS = [
  ['1', '2', '3', '+'],
  ['4', '5', '6', '−'],
  ['7', '8', '9', '×'],
  ['.', '0', 'confirm', '÷'],
];

// 3-column layout: numbers only
const KEYS_NO_OPS = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'confirm'],
];

function Numpad({
  onKeyPress,
  onDelete,
  onConfirm,
  showOperators = true,
  style,
  ...props
}: NumpadProps) {
  const colors = useThemeColors();
  const KEYS = showOperators ? KEYS_WITH_OPS : KEYS_NO_OPS;

  const handleKeyPress = (key: string) => {
    if (key === 'confirm') {
      onConfirm();
    } else {
      onKeyPress(key);
    }
  };

  const isOperator = (key: string) => ['+', '−', '×', '÷'].includes(key);

  return (
    <View style={[{ gap: 8 }, style]} {...props}>
      {KEYS.map((row, rowIndex) => (
        <View key={rowIndex} style={{ flexDirection: 'row', gap: 8 }}>
          {row.map((key) => {
            if (key === 'confirm') {
              return (
                <Pressable
                  key={key}
                  onPress={onConfirm}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  style={{
                    flex: 1,
                    height: 52,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 12,
                    backgroundColor: colors.primary,
                  }}
                >
                  <Icon as={Check} size={28} color={colors.primaryForeground} />
                </Pressable>
              );
            }

            return (
              <Pressable
                key={key}
                onPress={() => handleKeyPress(key)}
                hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
                style={{
                  flex: 1,
                  height: 52,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: isOperator(key) ? colors.muted : colors.background,
                }}
              >
                <Text
                  color={colors.foreground}
                  style={{
                    fontSize: isOperator(key) ? 24 : 28,
                    fontFamily: isOperator(key) ? 'NotoSansSC_400Regular' : 'NotoSansSC_500Medium',
                  }}
                >
                  {key}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
}

export { Numpad };
