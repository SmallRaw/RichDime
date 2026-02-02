import { Button, Icon, Text, useThemeColors } from '@rich-dime/component';
import { Link } from 'expo-router';
import { StarIcon } from 'lucide-react-native';
import { Image, type ImageStyle, View } from 'react-native';
import { useTheme } from '../../hooks/use-theme';

const LOGO = {
  light: require('@/assets/images/react-native-reusables-light.png'),
  dark: require('@/assets/images/react-native-reusables-dark.png'),
};

const IMAGE_STYLE: ImageStyle = {
  height: 76,
  width: 76,
};

/**
 * Welcome feature - displays welcome message and links
 */
export function WelcomeFeature() {
  const { theme } = useTheme();
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 32, padding: 16 }}>
      <Image source={LOGO[theme]} style={IMAGE_STYLE} resizeMode="contain" />

      <View style={{ gap: 8, padding: 16 }}>
        <Text style={{ fontFamily: 'monospace', fontSize: 14 }} color={colors.mutedForeground}>
          1. Edit <Text variant="code">app/index.tsx</Text> to get started.
        </Text>
        <Text style={{ fontFamily: 'monospace', fontSize: 14 }} color={colors.mutedForeground}>
          2. Save to see your changes instantly.
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Link href="https://reactnativereusables.com" asChild>
          <Button>
            <Text>Browse the Docs</Text>
          </Button>
        </Link>
        <Link href="https://github.com/founded-labs/react-native-reusables" asChild>
          <Button variant="ghost">
            <Text>Star the Repo</Text>
            <Icon as={StarIcon} size={16} color={colors.foreground} />
          </Button>
        </Link>
      </View>
    </View>
  );
}
