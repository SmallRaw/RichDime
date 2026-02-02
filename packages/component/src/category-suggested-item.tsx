import * as React from 'react';
import { View, Pressable, type ViewProps, type ViewStyle } from 'react-native';
import { Text } from './text';
import { Icon } from './icon';
import { Smile, Plus } from 'lucide-react-native';
import { useThemeColors } from './use-theme-colors';

export interface CategorySuggestedItemProps extends Omit<ViewProps, 'style'> {
  name: string;
  onAdd?: () => void;
  style?: ViewStyle;
}

function CategorySuggestedItem({
  name,
  onAdd,
  style,
  ...props
}: CategorySuggestedItemProps) {
  const colors = useThemeColors();

  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
        },
        style,
      ]}
      {...props}
    >
      {/* Left: icon + name */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <Icon as={Smile} size={22} color={colors.mutedForeground} />
        <Text
          style={{
            fontSize: 15,
            fontFamily: 'NotoSansSC_400Regular',
          }}
          color={colors.foreground}
        >
          {name}
        </Text>
      </View>

      {/* Right: plus button */}
      <Pressable
        onPress={onAdd}
        style={{
          height: 24,
          width: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon as={Plus} size={20} color={colors.mutedForeground} />
      </Pressable>
    </View>
  );
}

export { CategorySuggestedItem };
