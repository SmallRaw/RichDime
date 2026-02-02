import { View } from 'react-native';
import { Text, Button, useThemeColors } from '@rich-dime/component';
import { useProfile } from './use-profile';

export function ProfileFeature() {
  const colors = useThemeColors();
  const { user, loading, refresh } = useProfile();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ gap: 16, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '700' }} color={colors.foreground}>{user?.name}</Text>
      <Text color={colors.mutedForeground}>{user?.email}</Text>
      <Button onPress={refresh}>
        <Text>Refresh Profile</Text>
      </Button>
    </View>
  );
}