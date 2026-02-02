// packages/kit/src/screens/profile/profile-screen.tsx
import { View } from 'react-native';
import { Text, useThemeColors } from '@rich-dime/component';
import { ProfileFeature } from '../../features/profile';

export function ProfileScreen() {
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 24, fontWeight: '700', marginBottom: 16 }} color={colors.foreground}>Profile</Text>
      <ProfileFeature />
    </View>
  );
}