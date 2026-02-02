import * as React from 'react';
import { Image, View, type ViewStyle } from 'react-native';
import { Text } from './text';
import { useThemeColors } from './use-theme-colors';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 56,
};

const FONT_SIZE_MAP = {
  sm: 12,
  md: 14,
  lg: 16,
};

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
  style?: ViewStyle;
}

function Avatar({ src, alt, fallback, size = 'md', style }: AvatarProps) {
  const colors = useThemeColors();
  const [hasError, setHasError] = React.useState(false);

  const showFallback = !src || hasError;
  const initials = fallback || alt?.slice(0, 2).toUpperCase() || '??';
  const dimension = SIZE_MAP[size];
  const fontSize = FONT_SIZE_MAP[size];

  return (
    <View
      style={[
        {
          height: dimension,
          width: dimension,
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          borderRadius: 9999,
          backgroundColor: colors.secondary,
        },
        style,
      ]}
    >
      {showFallback ? (
        <Text
          style={{
            fontSize,
            fontFamily: 'NotoSansSC_600SemiBold',
          }}
          color={colors.foreground}
        >
          {initials}
        </Text>
      ) : (
        <Image
          source={{ uri: src }}
          alt={alt}
          style={{ height: '100%', width: '100%' }}
          onError={() => setHasError(true)}
        />
      )}
    </View>
  );
}

export { Avatar };
