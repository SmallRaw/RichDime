import * as React from 'react';
import { View, ActivityIndicator, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface LoadingStateProps extends Omit<ViewProps, 'style'> {
  message?: string;
  size?: 'small' | 'large';
  style?: ViewStyle;
}

function LoadingState({
  message = '加载中...',
  size = 'large',
  style,
  ...props
}: LoadingStateProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...props}
    >
      <ActivityIndicator size={size} color={colors.primary} />
      {message && (
        <Text
          style={{ marginTop: 8 }}
          color={colors.mutedForeground}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

export { LoadingState };
