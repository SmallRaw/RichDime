import { Stack } from 'expo-router';
import { NotFoundScreen } from '@rich-dime/kit/screens';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <NotFoundScreen />
    </>
  );
}
