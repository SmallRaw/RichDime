import { Button, Icon, useThemeColors } from '@rich-dime/component';
// import { Stack } from 'expo-router';
import { MoonStarIcon, SunIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { WelcomeFeature } from '../../features/welcome';
import { useTheme } from '../../hooks/use-theme';

const SCREEN_OPTIONS = {
  title: 'React Native Reusables',
  headerTransparent: true,
  headerRight: () => <ThemeToggle />,
};

const THEME_ICONS = {
  light: SunIcon,
  dark: MoonStarIcon,
};

/**
 * Home screen - main landing screen
 */
export function HomeScreen() {
  const colors = useThemeColors();

  return (
    <>
      {/* <Stack.Screen options={SCREEN_OPTIONS} /> */}
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <WelcomeFeature />
      </View>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const colors = useThemeColors();

  return (
    <Button
      onPress={toggleTheme}
      size="icon"
      variant="ghost"
      style={{ width: 36, height: 36, borderRadius: 9999 }}
    >
      <Icon as={THEME_ICONS[theme]} size={20} color={colors.foreground} />
    </Button>
  );
}
