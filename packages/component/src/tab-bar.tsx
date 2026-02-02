import * as React from 'react';
import { View, Pressable, type ViewProps, type PressableProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import type { LucideIcon } from 'lucide-react-native';

export interface TabBarProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function TabBar({ children, style, ...props }: TabBarProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          height: 64,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-around',
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
          paddingHorizontal: 16,
          paddingVertical: 8,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export interface TabItemProps extends Omit<PressableProps, 'children' | 'style'> {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function TabItem({
  icon,
  label,
  active = false,
  style,
  ...props
}: TabItemProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      style={[
        {
          alignItems: 'center',
          gap: 4,
        },
        style,
      ]}
      {...props}
    >
      <Icon
        as={icon}
        size={24}
        color={active ? colors.foreground : colors.mutedForeground}
      />
      <Text
        variant={active ? 'tabLabelActive' : 'tabLabel'}
        color={active ? colors.foreground : undefined}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export { TabBar, TabItem };
