// packages/kit/src/layouts/main-layout.tsx
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/use-theme';
import { useThemeColors } from '@rich-dime/component';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const colors = useThemeColors();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {children}
      </View>
    </>
  );
}