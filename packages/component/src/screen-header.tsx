import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export interface ScreenHeaderProps extends Omit<ViewProps, 'style'> {
  title?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  center?: React.ReactNode;
  style?: ViewStyle;
}

function ScreenHeader({
  title,
  left,
  right,
  center,
  style,
  ...props
}: ScreenHeaderProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          height: 56,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
        },
        style,
      ]}
      {...props}
    >
      {left ?? (title ? (
        <Text
          style={{
            fontSize: 17,
            fontFamily: 'NotoSansSC_600SemiBold',
          }}
          color={colors.foreground}
        >
          {title}
        </Text>
      ) : <View />)}
      {center}
      {right ?? <View />}
    </View>
  );
}

export { ScreenHeader };
