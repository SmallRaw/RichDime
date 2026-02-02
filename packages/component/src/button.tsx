import * as React from 'react';
import { Platform, Pressable, type PressableProps, type ViewStyle } from 'react-native';
import { useThemeColors } from './use-theme-colors';

// Size definitions - aligned with Pencil MCP design tokens
const SIZES = {
  default: { height: 40, paddingHorizontal: 16, paddingVertical: 8, gap: 6 },
  sm: { height: 36, paddingHorizontal: 12, paddingVertical: 6, gap: 6 },
  lg: { height: 44, paddingHorizontal: 24, paddingVertical: 8, gap: 6 },
  icon: { height: 40, width: 40, paddingHorizontal: 0, paddingVertical: 0, gap: 0 },
} as const;

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = keyof typeof SIZES;

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function Button({
  variant = 'default',
  size = 'default',
  style,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const colors = useThemeColors();
  const sizeStyle = SIZES[size];

  // Get variant-specific colors
  const getVariantStyle = (pressed: boolean): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      gap: sizeStyle.gap,
      height: sizeStyle.height,
      paddingHorizontal: sizeStyle.paddingHorizontal,
      paddingVertical: sizeStyle.paddingVertical,
      ...(size === 'icon' && { width: (sizeStyle as typeof SIZES['icon']).width }),
    };

    switch (variant) {
      case 'default':
        return {
          ...baseStyle,
          backgroundColor: pressed ? adjustColor(colors.primary, -10) : colors.primary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            },
            android: { elevation: 1 },
          }),
        };

      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: pressed ? adjustColor(colors.destructive, -10) : colors.destructive,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            },
            android: { elevation: 1 },
          }),
        };

      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: pressed ? colors.accent : colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            },
            android: { elevation: 1 },
          }),
        };

      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: pressed ? adjustColor(colors.secondary, -5) : colors.secondary,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1,
            },
            android: { elevation: 1 },
          }),
        };

      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: pressed ? colors.accent : 'transparent',
        };

      case 'link':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };

      default:
        return baseStyle;
    }
  };

  // Get text color for variant
  const getTextColor = (): string => {
    switch (variant) {
      case 'default':
        return colors.primaryForeground;
      case 'destructive':
        return colors.white;
      case 'outline':
        return colors.foreground;
      case 'secondary':
        return colors.secondaryForeground;
      case 'ghost':
        return colors.foreground;
      case 'link':
        return colors.primary;
      default:
        return colors.foreground;
    }
  };

  return (
    <Pressable
      role="button"
      disabled={disabled}
      style={({ pressed }) => [
        getVariantStyle(pressed),
        disabled && { opacity: 0.5 },
        style,
      ]}
      {...props}
    >
      {typeof children === 'function'
        ? children
        : React.Children.map(children, (child) => {
            if (React.isValidElement(child) && child.type && (child.type as any).displayName === 'Text') {
              return React.cloneElement(child as React.ReactElement<any>, {
                color: getTextColor(),
              });
            }
            return child;
          })}
    </Pressable>
  );
}

// Helper to adjust color brightness
function adjustColor(color: string, amount: number): string {
  // Simple adjustment - in production you'd want a proper color library
  return color;
}

export { Button };
