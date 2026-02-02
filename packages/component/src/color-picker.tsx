import { View, Pressable, Modal } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { X, Check } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

const AVAILABLE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#f97316',
  '#a855f7',
  '#06b6d4',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#78716c',
  '#6366f1',
  '#8b5cf6',
  '#f472b6',
  '#22c55e',
  '#64748b',
];

export interface ColorPickerProps {
  visible: boolean;
  selectedColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

export function ColorPicker({
  visible,
  selectedColor,
  onSelect,
  onClose,
}: ColorPickerProps) {
  const colors = useThemeColors();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' }}
        onPress={onClose}
      />
      <View
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          backgroundColor: colors.background,
          paddingHorizontal: 16,
          paddingBottom: 32,
          paddingTop: 16,
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: 'NotoSansSC_600SemiBold',
            }}
            color={colors.foreground}
          >
            Select Color
          </Text>
          <Pressable
            onPress={onClose}
            style={{
              height: 32,
              width: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 9999,
              backgroundColor: colors.muted,
            }}
          >
            <Icon as={X} size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        {/* Color Grid */}
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          {AVAILABLE_COLORS.map((color) => {
            const isSelected = color === selectedColor;
            return (
              <Pressable
                key={color}
                onPress={() => onSelect(color)}
                style={{
                  height: 48,
                  width: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 12,
                  backgroundColor: color,
                }}
              >
                {isSelected && <Icon as={Check} size={24} color="#ffffff" />}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}
