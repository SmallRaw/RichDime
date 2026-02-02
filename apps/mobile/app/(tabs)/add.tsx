import { View } from 'react-native';
import { Text, useThemeColors } from '@rich-dime/component';

// This is a placeholder screen - the actual add transaction is handled by a modal
export default function AddPlaceholder() {
  const colors = useThemeColors();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
      <Text color={colors.mutedForeground}>Add Transaction</Text>
    </View>
  );
}
