import * as React from 'react';
import { View, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import { GripVertical } from 'lucide-react-native';

export interface CategoryListItemProps extends Omit<PressableProps, 'children' | 'style'> {
  emoji: string;
  name: string;
  color: string;
  showDragHandle?: boolean;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CategoryListItem({
  emoji,
  name,
  color,
  showDragHandle = false,
  style,
  ...props
}: CategoryListItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderBottomColor: colors.border,
        },
        style,
      ]}
      {...props}
    >
      {/* Left: emoji + name */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Text variant="emoji">{emoji}</Text>
        <Text variant="bodyMedium">{name}</Text>
      </View>

      {/* Right: color swatch (+ drag handle in sort mode) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <View
          style={{
            width: 28,
            height: 28,
            backgroundColor: color,
            borderRadius: 8,
          }}
        />
        {showDragHandle && (
          <Icon
            as={GripVertical}
            size={20}
            color={colors.mutedForeground}
          />
        )}
      </View>
    </Pressable>
  );
}

export { CategoryListItem };
