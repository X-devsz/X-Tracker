/**
 * Tab Layout — Bottom tab navigator
 *
 * 4 tabs: Home, History, Insights, Settings
 */
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

const tabs: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'history', title: 'History', icon: 'list-outline', iconFocused: 'list' },
  { name: 'insights', title: 'Insights', icon: 'pie-chart-outline', iconFocused: 'pie-chart' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', iconFocused: 'settings' },
];

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.tabBarActive?.val,
        tabBarInactiveTintColor: theme.tabBarInactive?.val,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground?.val,
          borderTopColor: theme.tabBarBorder?.val,
          borderTopWidth: 1,
          paddingTop: 6,
          paddingBottom: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter',
          fontWeight: '500' as const,
          fontSize: 11,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({
              color,
              focused,
              size,
            }: {
              color: string;
              focused: boolean;
              size: number;
            }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.icon}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
