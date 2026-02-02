import { Button, Text, useThemeColors } from '@rich-dime/component';
import { View } from 'react-native';
import { Link } from '../../navigation/link';

/**
 * 404 Not Found Screen
 * Displayed when user navigates to a non-existent route
 */
export function NotFoundScreen() {
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, padding: 16, backgroundColor: colors.background }}>
      <Text style={{ fontSize: 36, fontWeight: '700' }} color={colors.foreground}>404</Text>
      <Text style={{ fontSize: 20 }} color={colors.mutedForeground}>
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
