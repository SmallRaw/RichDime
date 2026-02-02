import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

export interface IconProps extends Omit<LucideProps, 'color'> {
  as: LucideIcon;
  /** Icon color. Defaults to theme foreground color */
  color?: string;
}

/**
 * A wrapper component for Lucide icons.
 *
 * @component
 * @example
 * ```tsx
 * import { ArrowRight } from 'lucide-react-native';
 * import { Icon } from '@rich-dime/kit';
 *
 * <Icon as={ArrowRight} color="#ff0000" size={16} />
 * ```
 *
 * @param {LucideIcon} as - The Lucide icon component to render.
 * @param {string} color - Icon color. Defaults to theme foreground.
 * @param {number} size - Icon size (defaults to 14).
 * @param {...LucideProps} ...props - Additional Lucide icon props.
 */
function Icon({ as: IconComponent, color, size = 14, ...props }: IconProps) {
  const colors = useThemeColors();
  const iconColor = color ?? colors.foreground;

  return <IconComponent color={iconColor} size={size} {...props} />;
}

export { Icon };
