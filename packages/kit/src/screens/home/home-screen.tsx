import { Button, Icon } from '@rich-dime/component';
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
  return (
    <>
      {/* <Stack.Screen options={SCREEN_OPTIONS} /> */}
      <View className="flex-1">
        <WelcomeFeature />
      </View>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onPress={toggleTheme}
      size="icon"
      variant="ghost"
      className="ios:size-9 rounded-full web:mx-4"
    >
      <Icon as={THEME_ICONS[theme]} className="size-5" />
    </Button>
  );
}
