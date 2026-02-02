import { Button, Text } from '@rich-dime/component';
import { View } from 'react-native';
import { Link } from '../../navigation/link';

/**
 * 404 Not Found Screen
 * Displayed when user navigates to a non-existent route
 */
export function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center gap-4 p-4">
      <Text className="text-4xl font-bold">404</Text>
      <Text className="text-xl text-muted-foreground">
        This screen doesn't exist.
      </Text>

      <Link href="/">
        <Button>
          <Text>Go to home screen</Text>
        </Button>
      </Link>
    </View>
  );
}
