import * as Slot from '@rn-primitives/slot';
import * as React from 'react';
import { Platform, Text as RNText, type Role, type TextStyle } from 'react-native';
import { Text as TamaguiText } from 'tamagui';

/**
 * Typography system aligned with Pencil MCP design tokens
 *
 * Size tokens (Phone):
 * - xs: 11px, sm: 13px, base: 15px, lg: 17px, xl: 20px
 * - 2xl: 24px, 3xl: 30px, 4xl: 36px, 5xl: 48px
 *
 * Semantic variants:
 * - title: Large headings (lg, semibold)
 * - subtitle: Secondary headings (base, semibold)
 * - body: Default body text (base, normal)
 * - label: Form labels and small titles (sm, medium)
 * - caption: Secondary info text (sm, muted)
 * - overline: Section titles (xs, medium, uppercase, tracking)
 * - amount: Financial amounts (2xl, bold)
 * - amountLg: Large amounts (3xl-5xl)
 */

// Font sizes matching design tokens
const FONT_SIZES = {
  xs: 11,
  badge: 12,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  emoji: 22,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 64,
} as const;

// Font families
const FONTS = {
  sans: 'NotoSansSC_400Regular',
  sansMedium: 'NotoSansSC_500Medium',
  sansSemibold: 'NotoSansSC_600SemiBold',
  sansBold: 'NotoSansSC_700Bold',
} as const;

export type TextVariant =
  | 'default'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'bodyMedium'
  | 'label'
  | 'labelMedium'
  | 'caption'
  | 'description'
  | 'overline'
  | 'secondary'
  | 'badge'
  | 'emoji'
  | 'tabLabel'
  | 'tabLabelActive'
  | 'amount'
  | 'amountLg'
  | 'amountCurrency'
  | 'amountDecimal'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'p'
  | 'blockquote'
  | 'code'
  | 'lead'
  | 'large'
  | 'small'
  | 'muted';

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
  h4: 'heading',
  title: 'heading',
  blockquote: Platform.select({ web: 'blockquote' as Role }),
  code: Platform.select({ web: 'code' as Role }),
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
  h4: '4',
  title: '2',
};

// Variant style definitions
const VARIANT_STYLES: Record<TextVariant, {
  fontSize: number;
  fontFamily: string;
  color?: string;
  textTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
  letterSpacing?: number;
  lineHeight?: number;
}> = {
  // Default - base text
  default: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sans,
  },

  // Semantic Typography Variants
  title: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.sansSemibold,
  },

  subtitle: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sansSemibold,
  },

  body: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sans,
  },

  bodyMedium: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sansMedium,
  },

  label: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sansSemibold,
  },

  labelMedium: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sansMedium,
  },

  caption: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
  },

  description: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
    lineHeight: 20,
  },

  overline: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.sansMedium,
    color: '$mutedForeground',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  secondary: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
  },

  badge: {
    fontSize: FONT_SIZES.badge,
    fontFamily: FONTS.sansSemibold,
  },

  emoji: {
    fontSize: FONT_SIZES.emoji,
    fontFamily: FONTS.sans,
  },

  tabLabel: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
  },

  tabLabelActive: {
    fontSize: FONT_SIZES.xs,
    fontFamily: FONTS.sansMedium,
  },

  amount: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.sansBold,
  },

  amountLg: {
    fontSize: FONT_SIZES['5xl'],
    fontFamily: FONTS.sansBold,
  },

  amountCurrency: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.sansMedium,
  },

  amountDecimal: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.sansMedium,
  },

  // Legacy variants
  h1: {
    fontSize: FONT_SIZES['4xl'],
    fontFamily: FONTS.sansBold,
    letterSpacing: -0.5,
  },

  h2: {
    fontSize: FONT_SIZES['3xl'],
    fontFamily: FONTS.sansSemibold,
    letterSpacing: -0.5,
  },

  h3: {
    fontSize: FONT_SIZES['2xl'],
    fontFamily: FONTS.sansSemibold,
    letterSpacing: -0.5,
  },

  h4: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.sansSemibold,
    letterSpacing: -0.5,
  },

  p: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sans,
    lineHeight: 22,
  },

  blockquote: {
    fontSize: FONT_SIZES.base,
    fontFamily: FONTS.sans,
  },

  code: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sansSemibold,
  },

  lead: {
    fontSize: FONT_SIZES.xl,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
  },

  large: {
    fontSize: FONT_SIZES.lg,
    fontFamily: FONTS.sansSemibold,
  },

  small: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sansMedium,
  },

  muted: {
    fontSize: FONT_SIZES.sm,
    fontFamily: FONTS.sans,
    color: '$mutedForeground',
  },
};

const TextClassContext = React.createContext<string | undefined>(undefined);

export interface TextProps extends Omit<React.ComponentProps<typeof RNText>, 'style'> {
  variant?: TextVariant;
  asChild?: boolean;
  style?: TextStyle;
  /** Override color */
  color?: string;
  /** @deprecated Use style instead. Kept for backwards compatibility during migration. */
  className?: string;
}

function Text({
  style,
  asChild = false,
  variant = 'default',
  className,
  color: colorProp,
  ...props
}: TextProps) {
  const variantStyle = VARIANT_STYLES[variant];
  const Component = asChild ? Slot.Text : TamaguiText;

  // Build the combined style
  const combinedStyle: TextStyle = {
    fontSize: variantStyle.fontSize,
    fontFamily: variantStyle.fontFamily,
    ...(variantStyle.textTransform && { textTransform: variantStyle.textTransform }),
    ...(variantStyle.letterSpacing && { letterSpacing: variantStyle.letterSpacing }),
    ...(variantStyle.lineHeight && { lineHeight: variantStyle.lineHeight }),
    ...style,
  };

  // Determine color - prop > variant > default
  const finalColor = colorProp ?? (variantStyle.color ? undefined : '$foreground');

  return (
    <Component
      color={finalColor}
      {...(variantStyle.color && !colorProp && { color: variantStyle.color })}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      style={combinedStyle}
      {...props}
    />
  );
}

export { Text, TextClassContext };
