// packages/kit/src/layouts/tab-layout.tsx
import { Tabs } from 'expo-router';

export function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}