import * as React from 'react';
import { Pressable, View, type PressableProps, type ViewStyle, Platform } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import type { LucideIcon } from 'lucide-react-native';

export interface CategoryItemProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
  /** @deprecated Use style instead */
  iconContainerClassName?: string;
  /** @deprecated Use style instead */
  iconClassName?: string;
}

function CategoryItem({
  icon,
  label,
  selected = false,
  style,
  ...props
}: CategoryItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        {
          alignItems: 'center',
          gap: 8,
        },
        style,
      ]}
      {...props}
    >
      <View
        style={{
          height: 48,
          width: 48,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 12,
          backgroundColor: selected ? colors.primary : colors.muted,
        }}
      >
        <Icon
          as={icon}
          size={24}
          color={selected ? colors.primaryForeground : colors.mutedForeground}
        />
      </View>
      <Text
        style={{
          fontSize: 11,
          fontFamily: 'NotoSansSC_500Medium',
          textAlign: 'center',
        }}
        color={colors.foreground}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// For category picker wheel (chip style)
export interface CategoryChipProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
  /** @deprecated Use style instead */
  iconClassName?: string;
}

function CategoryChip({
  icon,
  label,
  selected = false,
  style,
  ...props
}: CategoryChipProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          borderRadius: 9999,
          backgroundColor: colors.card,
          paddingHorizontal: 16,
          paddingVertical: 8,
          opacity: selected ? 1 : 0.5,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
            },
            android: { elevation: 1 },
          }),
        },
        style,
      ]}
      {...props}
    >
      <Icon as={icon} size={16} color={colors.foreground} />
      <Text variant="labelMedium" color={colors.foreground}>
        {label}
      </Text>
    </Pressable>
  );
}

export { CategoryItem, CategoryChip };
