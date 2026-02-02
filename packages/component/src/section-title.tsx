import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';

export interface SectionTitleProps extends Omit<ViewProps, 'style'> {
  title: string;
  style?: ViewStyle;
  /** @deprecated Use style instead */
  className?: string;
}

function SectionTitle({ title, style, ...props }: SectionTitleProps) {
  return (
    <View
      style={[
        {
          paddingHorizontal: 16,
          paddingVertical: 8,
        },
        style,
      ]}
      {...props}
    >
      <Text variant="overline">{title}</Text>
    </View>
  );
}

export { SectionTitle };
