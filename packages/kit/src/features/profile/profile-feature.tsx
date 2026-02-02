import { View } from 'react-native';
import { Text, Button } from '@rich-dime/component';
import { useProfile } from './use-profile';

export function ProfileFeature() {
  const { user, loading, refresh } = useProfile();

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="gap-4 p-4">
      <Text className="text-xl font-bold">{user?.name}</Text>
      <Text className="text-muted-foreground">{user?.email}</Text>
      <Button onPress={refresh}>
        <Text>Refresh Profile</Text>
      </Button>
    </View>
  );
}