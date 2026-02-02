import { useEffect } from 'react';
import { AppProvider } from '@rich-dime/kit/providers';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, NotoSansSC_400Regular, NotoSansSC_500Medium, NotoSansSC_600SemiBold, NotoSansSC_700Bold } from '@expo-google-fonts/noto-sans-sc';
import tamaguiConfig from '../tamagui.config';

SplashScreen.preventAutoHideAsync();

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansSC_400Regular,
    NotoSansSC_500Medium,
    NotoSansSC_600SemiBold,
    NotoSansSC_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProvider tamaguiConfig={tamaguiConfig}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="add-transaction"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="category-picker"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="edit-categories"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="add-category"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="edit-category"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="storybook"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AppProvider>
  );
}
