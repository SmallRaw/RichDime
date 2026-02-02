import * as React from 'react';
import { View, Pressable, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface ErrorStateProps extends Omit<ViewProps, 'style'> {
  message: string;
  retryLabel?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

function ErrorState({
  message,
  retryLabel = '点击重试',
  onRetry,
  style,
  ...props
}: ErrorStateProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        },
        style,
      ]}
      {...props}
    >
      <Text color={colors.destructive}>{message}</Text>
      {onRetry && (
        <Pressable onPress={onRetry} style={{ marginTop: 16 }}>
          <Text color={colors.primary}>{retryLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

export { ErrorState };
