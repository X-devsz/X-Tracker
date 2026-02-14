/**
 * Tab Layout — Bottom tab navigator
 *
 * 4 tabs: Home, History, Insights, Settings
 */
import { Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { BackHandler } from 'react-native';
import { triggerHaptic } from '../../services/haptics';

type IconName = keyof typeof Ionicons.glyphMap;

const renderTabIcon =
  (icon: IconName, iconFocused: IconName) =>
  ({ color, focused, size }: { color: string; focused: boolean; size: number }) => (
    <Ionicons name={focused ? iconFocused : icon} size={size} color={color} />
  );

export default function TabLayout() {
  const theme = useTheme();

  // Prevent going back from the tabs navigator
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <Tabs
      screenListeners={{
        tabPress: () => triggerHaptic('selection'),
      }}
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
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: renderTabIcon('home-outline', 'home'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: renderTabIcon('list-outline', 'list'),
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: renderTabIcon('pie-chart-outline', 'pie-chart'),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: renderTabIcon('settings-outline', 'settings'),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
