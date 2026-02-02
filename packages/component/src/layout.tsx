import * as React from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

// ============ Stack (Vertical Layout) ============

export interface StackProps extends Omit<ViewProps, 'style'> {
  gap?: number;
  ai?: ViewStyle['alignItems'];
  jc?: ViewStyle['justifyContent'];
  style?: ViewStyle;
}

function Stack({ style, gap, ai, jc, children, ...props }: StackProps) {
  return (
    <View
      style={[{ flexDirection: 'column', gap, alignItems: ai, justifyContent: jc }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

// ============ YStack (Alias for Stack) ============

export interface YStackProps extends StackProps {}

function YStack(props: YStackProps) {
  return <Stack {...props} />;
}

// ============ Row (Horizontal Layout) ============

export interface RowProps extends Omit<ViewProps, 'style'> {
  gap?: number;
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  style?: ViewStyle;
}

function Row({ style, gap, align, justify, children, ...props }: RowProps) {
  return (
    <View
      style={[{ flexDirection: 'row', gap, alignItems: align, justifyContent: justify }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

// ============ Section (Content Section) ============

export interface SectionProps extends Omit<ViewProps, 'style'> {
  gap?: number;
  style?: ViewStyle;
}

function Section({ style, gap = 12, children, ...props }: SectionProps) {
  return (
    <View
      style={[{ paddingHorizontal: 16, gap }, style]}
      {...props}
    >
      {children}
    </View>
  );
}

export { Stack, YStack, Row, Section };
