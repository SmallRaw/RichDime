import * as React from 'react';
import { Pressable, Platform, type PressableProps, type ViewStyle } from 'react-native';
import { Icon } from './icon';
import { Plus } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

export type FABVariant = 'default' | 'secondary';
export type FABSize = 'default' | 'sm';

export interface FABProps extends Omit<PressableProps, 'style'> {
  icon?: LucideIcon;
  variant?: FABVariant;
  size?: FABSize;
  style?: ViewStyle;
}

function FAB({
  variant = 'default',
  size = 'default',
  icon = Plus,
  style,
  ...props
}: FABProps) {
  const colors = useThemeColors();

  const getBackgroundColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };

  const getIconColor = (): string => {
    switch (variant) {
      case 'secondary':
        return colors.secondaryForeground;
      default:
        return colors.primaryForeground;
    }
  };

  const getSizeStyles = (): { width: number; height: number; borderRadius: number } => {
    switch (size) {
      case 'sm':
        // FAB/Small: 48x48, radius-lg (12), shadow blur 16, offset y 6
        return { width: 48, height: 48, borderRadius: 12 };
      default:
        // FAB/Default: 56x56, radius-xl (16), shadow blur 20, offset y 8
        return { width: 56, height: 56, borderRadius: 16 };
    }
  };

  const getShadowStyles = () => {
    switch (size) {
      case 'sm':
        return Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.125,
            shadowRadius: 16,
          },
          android: { elevation: 6 },
        });
      default:
        return Platform.select({
          ios: {
            shadowColor: '#000000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.125,
            shadowRadius: 20,
          },
          android: { elevation: 8 },
        });
    }
  };

  const getIconSize = (): number => {
    switch (size) {
      case 'sm':
        return 20;
      default:
        return 24;
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <Pressable
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: getBackgroundColor(),
          ...sizeStyles,
          ...getShadowStyles(),
        },
        style,
      ]}
      {...props}
    >
      <Icon as={icon} color={getIconColor()} size={getIconSize()} />
    </Pressable>
  );
}

export { FAB };
