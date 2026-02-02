import * as React from 'react';
import { View, type ViewProps, type ViewStyle, type TextStyle, Platform } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

const CARD_PADDING = 16;

// Card Root
export interface CardProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function Card({ style, children, ...props }: CardProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          overflow: 'hidden',
          borderRadius: 8,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.card,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 1.75,
            },
            android: { elevation: 1 },
          }),
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// Card Header
export interface CardHeaderProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CardHeader({ style, children, ...props }: CardHeaderProps) {
  return (
    <View
      style={[
        {
          gap: 6,
          padding: CARD_PADDING,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// Card Title
export interface CardTitleProps {
  children: React.ReactNode;
  style?: TextStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CardTitle({ children, style }: CardTitleProps) {
  const colors = useThemeColors();

  return (
    <Text
      variant="title"
      style={style}
      color={colors.cardForeground}
    >
      {children}
    </Text>
  );
}

// Card Description
export interface CardDescriptionProps {
  children: React.ReactNode;
  style?: TextStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CardDescription({ children, style }: CardDescriptionProps) {
  return (
    <Text variant="caption" style={style}>
      {children}
    </Text>
  );
}

// Card Content
export interface CardContentProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CardContent({ style, children, ...props }: CardContentProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: CARD_PADDING,
          paddingBottom: CARD_PADDING,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

// Card Footer
export interface CardFooterProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function CardFooter({ style, children, ...props }: CardFooterProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: CARD_PADDING,
          paddingBottom: CARD_PADDING,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
