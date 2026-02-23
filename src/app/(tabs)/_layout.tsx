import { Redirect, Tabs } from 'expo-router';
import { useTheme } from 'tamagui';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store';
import { AUTH_ENABLED } from '../../config/featureFlags';

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
  const { user, loading } = useAuthStore();
  // Auth guards are feature-flagged for guest mode.
  const authEnabled = AUTH_ENABLED;

  if (authEnabled && loading) {
    // We are still checking the user's authentication state.
    // You can show a loading indicator here if you want.
    return null;
  }

  if (authEnabled && !user) {
    // The user is not signed in, so redirect them to the login screen.
    return <Redirect href="/(auth)/login" />;
  }

  // The user is signed in, so render the main application tabs.
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
      <Tabs.Screen
        name="categories"
        options={{
          href: null,
        }}
      />
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
