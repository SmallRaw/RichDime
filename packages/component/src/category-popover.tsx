import * as React from 'react';
import { View, Pressable, ScrollView, Animated, Dimensions } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { Pencil } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

export interface CategoryPopoverItem {
  id: string;
  emoji: string;
  label: string;
}

export interface CategoryPopoverProps {
  visible: boolean;
  categories: CategoryPopoverItem[];
  onSelect: (category: CategoryPopoverItem) => void;
  onClose: () => void;
  onEdit?: () => void;
}

function CategoryPopover({
  visible,
  categories,
  onSelect,
  onClose,
  onEdit,
}: CategoryPopoverProps) {
  const colors = useThemeColors();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
      // Scroll to bottom when opening (most used categories at bottom)
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: false });
      }, 50);
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim]);

  if (!visible) return null;

  const screenHeight = Dimensions.get('window').height;
  const popoverMaxHeight = screenHeight * 0.5;

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

      {/* Category Wheel - positioned on right side */}
      <View
        style={{
          position: 'absolute',
          right: 16,
          top: 180,
          width: 160,
          maxHeight: popoverMaxHeight,
        }}
      >
        {/* Edit Button - fixed at top */}
        <Pressable
          onPress={onEdit}
          style={{
            marginBottom: 8,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-end',
            borderRadius: 9999,
            backgroundColor: colors.card,
            paddingHorizontal: 16,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <Icon as={Pencil} size={14} color={colors.foreground} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: 'NotoSansSC_500Medium',
            }}
            color={colors.foreground}
          >
            Edit
          </Text>
        </Pressable>

        {/* Scrollable Category List */}
        <ScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            alignItems: 'flex-end',
          }}
        >
          {categories.map((category, index) => (
            <Pressable
              key={category.id}
              onPress={() => onSelect(category)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                borderRadius: 9999,
                backgroundColor: colors.card,
                paddingHorizontal: 16,
                paddingVertical: 8,
                opacity: index === 0 ? 0.5 : 1,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 16 }}>{category.emoji}</Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NotoSansSC_500Medium',
                }}
                color={colors.foreground}
              >
                {category.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

export { CategoryPopover };
