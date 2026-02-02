import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { useThemeColors } from './use-theme-colors';
import type { LucideIcon } from 'lucide-react-native';
import { Receipt } from 'lucide-react-native';

export interface EmptyStateProps extends Omit<ViewProps, 'style'> {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  /** When true, centers the content vertically in a flex-1 container */
  centered?: boolean;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function EmptyState({
  icon = Receipt,
  title,
  description,
  action,
  centered = false,
  style,
  ...props
}: EmptyStateProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          alignItems: 'center',
          gap: 16,
          paddingHorizontal: 24,
          paddingVertical: 32,
          ...(centered && { flex: 1, justifyContent: 'center' }),
        },
        style,
      ]}
      {...props}
    >
      {/* Icon Container */}
      <View
        style={{
          height: 64,
          width: 64,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 16,
          backgroundColor: colors.muted,
        }}
      >
        <Icon as={icon} size={32} color={colors.mutedForeground} />
      </View>

      {/* Text Container */}
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Text variant="title" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        {description && (
          <Text
            variant="description"
            style={{ textAlign: 'center', width: 240 }}
          >
            {description}
          </Text>
        )}
      </View>

      {action}
    </View>
  );
}

export { EmptyState };
