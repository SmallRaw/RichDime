import { NAV_THEME } from '@rich-dime/adapters';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui';
import { useEffect } from 'react';
import { AppState, View } from 'react-native';
import type { AppStateStatus } from 'react-native';
import { useTheme } from '../hooks/use-theme';
import { DatabaseProvider } from './database-provider';
import type { ReactNode } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
    },
  },
});

export interface AppProviderProps {
  children: ReactNode;
  /** Tamagui 配置 */
  tamaguiConfig: TamaguiProviderProps['config'];
  /** 是否跳过数据库初始化（用于测试） */
  skipDatabase?: boolean;
  /** 数据库初始化完成后的回调 */
  onDatabaseReady?: () => void;
}

/**
 * App provider - wraps the app with necessary providers
 * Use this in the root layout of your app
 */
export function AppProvider({
  children,
  tamaguiConfig,
  skipDatabase = false,
  onDatabaseReady,
}: AppProviderProps) {
  const { theme, isDark } = useTheme();

  // React Native focusManager: refetch stale queries when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (status: AppStateStatus) => {
      focusManager.setFocused(status === 'active');
    });
    return () => subscription.remove();
  }, []);

  const content = skipDatabase ? (
    children
  ) : (
    <DatabaseProvider onReady={onDatabaseReady}>
      {children}
    </DatabaseProvider>
  );

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme={isDark ? 'dark' : 'light'}>
      <ThemeProvider value={NAV_THEME[theme]}>
        <QueryClientProvider client={queryClient}>
          <View style={{ flex: 1 }}>
            <StatusBar style={isDark ? 'light' : 'dark'} />
            {content}
            <PortalHost />
          </View>
        </QueryClientProvider>
      </ThemeProvider>
    </TamaguiProvider>
  );
}
