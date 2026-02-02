// packages/kit/src/screens/settings/settings-screen.tsx
import { View, Pressable } from 'react-native';
import { Button, Text, Icon, useThemeColors } from '@rich-dime/component';
import { Link } from 'expo-router';
import { useTheme } from '../../hooks/use-theme';
import { BookOpen } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SettingsScreen() {
  const { toggleTheme, theme } = useTheme();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header with Storybook button */}
      <View
        style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: insets.top + 12 }}
      >
        <Text style={{ fontSize: 20, fontWeight: '600' }} color={colors.foreground}>设置</Text>
        {__DEV__ && (
          <Link href="/storybook" asChild>
            <Pressable style={{ padding: 8, borderRadius: 8 }}>
              <Icon as={BookOpen} size={24} color={colors.mutedForeground} />
            </Pressable>
          </Link>
        )}
      </View>

      {/* Settings content */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, gap: 16 }}>
        <Text>Current theme: {theme}</Text>
        <Button onPress={toggleTheme}>
          <Text>Toggle Theme</Text>
        </Button>
      </View>
    </View>
  );
}