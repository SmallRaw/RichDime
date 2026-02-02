// packages/kit/src/screens/profile/profile-screen.tsx
import { View } from 'react-native';
import { Text } from '@rich-dime/component';
import { ProfileFeature } from '../../features/profile';

export function ProfileScreen() {
  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl font-bold mb-4">Profile</Text>
      <ProfileFeature />
    </View>
  );
}