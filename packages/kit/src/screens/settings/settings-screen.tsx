// packages/kit/src/screens/settings/settings-screen.tsx
import { View, Pressable } from 'react-native';
import { Button, Text, Icon } from '@rich-dime/component';
import { Link } from 'expo-router';
import { useTheme } from '../../hooks/use-theme';
import { BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsScreen() {
  const { toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background">
      {/* Header with Storybook button */}
      <View
        className="flex-row items-center justify-between px-4 py-3 border-b border-border"
        style={{ paddingTop: insets.top + 12 }}
      >
        <Text className="text-xl font-semibold text-foreground">设置</Text>
        {__DEV__ && (
          <Link href="/storybook" asChild>
            <Pressable className="p-2 rounded-lg active:bg-muted">
              <Icon as={BookOpen} className="size-6 text-muted-foreground" />
            </Pressable>
          </Link>
        )}
      </View>

      {/* Settings content */}
      <View className="flex-1 items-center justify-center p-4 gap-4">
        <Text>Current theme: {theme}</Text>
        <Button onPress={toggleTheme}>
          <Text>Toggle Theme</Text>
        </Button>
      </View>
    </View>
  );
}