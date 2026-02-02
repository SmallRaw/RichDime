import React from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Icon, FAB } from '@rich-dime/component';
import { Receipt, ChartPie } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { THEME } from '@rich-dime/common';
import { useTheme } from '@rich-dime/kit/hooks';

function TabBarIcon({
  icon: IconComponent,
  focused,
}: {
  icon: typeof Receipt;
  focused: boolean;
}) {
  const { theme } = useTheme();
  const colors = THEME[theme];

  return (
    <Icon
      as={IconComponent}
      size={24}
      color={focused ? colors.foreground : colors.mutedForeground}
    />
  );
}

export default function TabLayout() {
  const router = useRouter();
  const { theme } = useTheme();
  const colors = THEME[theme];

  return (
    <Tabs
      key={theme}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 64,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.card,
        },
        tabBarLabelStyle: {
          fontFamily: 'NotoSansSC_400Regular',
        },
        tabBarActiveTintColor: colors.foreground,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '流水',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={Receipt} focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: '',
          tabBarButton: () => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <FAB
                onPress={() => router.push('/add-transaction')}
                style={{ position: 'absolute', top: -12 }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="statistics"
        options={{
          title: '统计',
          tabBarIcon: ({ focused }) => <TabBarIcon icon={ChartPie} focused={focused} />,
        }}
      />
    </Tabs>
  );
}
