// packages/kit/src/layouts/main-layout.tsx
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../hooks/use-theme';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View className="flex-1 bg-background">
        {children}
      </View>
    </>
  );
}