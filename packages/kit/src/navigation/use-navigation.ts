// packages/kit/src/navigation/use-navigation.ts
import { Platform } from 'react-native';
import { useRouter as useExpoRouter } from 'expo-router';
// import { useRouter as useNextRouter } from 'next/navigation';

export function useNavigation() {
  if (Platform.OS === 'web') {
    // const router = useNextRouter();
    // return { navigate: router.push, ... };
    return { navigate: () => {} }; // placeholder for web
  }
  const router = useExpoRouter();
  return { navigate: router.push };
}