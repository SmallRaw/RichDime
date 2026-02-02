import { View, Pressable, Modal, ScrollView } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { X } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

// Category-related emojis grouped by type
const EMOJI_GROUPS = [
  {
    title: 'Food & Drink',
    emojis: ['🍽️', '🍔', '☕', '🍕', '🍜', '🍰', '🍺', '🥗'],
  },
  {
    title: 'Shopping',
    emojis: ['🛒', '🛍️', '👔', '👟', '💄', '💎', '🎁', '📱'],
  },
  {
    title: 'Transport',
    emojis: ['🚗', '🚌', '🚕', '✈️', '🚀', '⛽', '🚲', '🚇'],
  },
  {
    title: 'Entertainment',
    emojis: ['🎮', '🎬', '🎵', '📖', '🎨', '🏋️', '⚽', '🎯'],
  },
  {
    title: 'Home & Life',
    emojis: ['🏠', '💡', '🔧', '🛋️', '🌱', '🐕', '👶', '❤️'],
  },
  {
    title: 'Work & Finance',
    emojis: ['💼', '💰', '📈', '💵', '🏦', '📊', '💳', '🎓'],
  },
  {
    title: 'Health',
    emojis: ['🏥', '💊', '🩺', '🧘', '😷', '🦷', '👓', '🧴'],
  },
  {
    title: 'Other',
    emojis: ['📁', '⭐', '🔔', '📌', '🎪', '🌍', '☀️', '🌙'],
  },
];

export interface EmojiPickerProps {
  visible: boolean;
  selectedEmoji?: string;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

export function EmojiPicker({
  visible,
  selectedEmoji,
  onSelect,
  onClose,
}: EmojiPickerProps) {
  const colors = useThemeColors();

  // Helper to create rgba with opacity from hex
  const withOpacity = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

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
          maxHeight: '70%',
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
            Select Icon
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

        {/* Emoji Grid */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {EMOJI_GROUPS.map((group) => (
            <View key={group.title} style={{ marginBottom: 16 }}>
              <Text
                style={{
                  marginBottom: 8,
                  fontSize: 12,
                  fontFamily: 'NotoSansSC_500Medium',
                  textTransform: 'uppercase',
                }}
                color={colors.mutedForeground}
              >
                {group.title}
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {group.emojis.map((emoji) => {
                  const isSelected = emoji === selectedEmoji;
                  return (
                    <Pressable
                      key={emoji}
                      onPress={() => onSelect(emoji)}
                      style={{
                        height: 48,
                        width: 48,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 12,
                        backgroundColor: isSelected
                          ? withOpacity(colors.primary, 0.2)
                          : colors.muted,
                      }}
                    >
                      <Text style={{ fontSize: 24 }}>{emoji}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}
