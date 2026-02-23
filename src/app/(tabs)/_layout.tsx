import { useEffect } from 'react';
import { Redirect, Tabs } from 'expo-router';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { useTheme } from 'tamagui';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useAuthStore } from '@/store';
import { AUTH_ENABLED } from '@/config/featureFlags';
import { haptics } from '@/services/haptics';
import { radius, space, size } from '@/theme/tokens';
import { fontFamily, fontSize, fontWeight } from '@/theme/typography';
import { useShallow } from 'zustand/react/shallow';

type IconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  icon: IconName;
  iconFocused: IconName;
}

interface TabBarButtonProps extends BottomTabBarButtonProps {
  activeBackground: string;
  inactiveBackground: string;
  rippleColor?: string;
}

interface TabBarIconProps {
  focused: boolean;
  color: string;
  size: number;
  icon: IconName;
  iconFocused: IconName;
}

const TabBarButton = ({
  activeBackground,
  inactiveBackground,
  rippleColor,
  children,
  onPress,
  onLongPress,
  accessibilityState,
  accessibilityRole,
  accessibilityLabel,
  testID,
  style,
  disabled,
}: TabBarButtonProps) => {
  const isFocused = Boolean(accessibilityState?.selected);
  const focusProgress = useSharedValue(isFocused ? 1 : 0);

  useEffect(() => {
    focusProgress.value = withTiming(isFocused ? 1 : 0, { duration: 180 });
  }, [focusProgress, isFocused]);

  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      focusProgress.value,
      [0, 1],
      [inactiveBackground, activeBackground],
    ),
  }));

  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      onLongPress={onLongPress}
      onPress={(event) => {
        haptics.selection();
        onPress?.(event);
      }}
      style={[style, { borderRadius: radius.md, overflow: 'hidden' }]}
      disabled={disabled}
      android_ripple={rippleColor ? { color: rippleColor } : undefined}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: space[0],
            right: space[0],
            bottom: space[0],
            left: space[0],
            borderRadius: radius.md,
          },
          animatedStyle,
        ]}
      />
      {children}
    </Pressable>
  );
};

const TabBarIcon = ({ focused, color, size, icon, iconFocused }: TabBarIconProps) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (!focused) return;
    scale.value = withSequence(
      withSpring(1.12, { damping: 12, stiffness: 220 }),
      withSpring(1, { damping: 12, stiffness: 220 }),
    );
  }, [focused, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={focused ? iconFocused : icon} size={size} color={color} />
    </Animated.View>
  );
};

const tabs: TabConfig[] = [
  { name: 'index', title: 'Home', icon: 'home-outline', iconFocused: 'home' },
  { name: 'history', title: 'History', icon: 'list-outline', iconFocused: 'list' },
  { name: 'insights', title: 'Insights', icon: 'pie-chart-outline', iconFocused: 'pie-chart' },
  { name: 'settings', title: 'Settings', icon: 'settings-outline', iconFocused: 'settings' },
];

export default function TabLayout() {
  const theme = useTheme();
  const { user, loading } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      loading: state.loading,
    })),
  );
  const rippleColor = theme.surfaceHover?.val ?? theme.tabBarBorder?.val;
  const fallbackBackground =
    theme.background?.val ??
    theme.surface?.val ??
    theme.tabBarBorder?.val ??
    theme.primary?.val ??
    theme.textPrimary?.val ??
    theme.textSecondary?.val;
  // Auth guards are feature-flagged for guest mode.
  const authEnabled = AUTH_ENABLED;

  if (!fallbackBackground) {
    return null;
  }

  const inactiveBackground = theme.tabBarBackground?.val ?? fallbackBackground;
  const activeBackground = theme.surfaceHover?.val ?? inactiveBackground;

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
          paddingTop: space.xs,
          paddingBottom: space.sm,
          height: size['2xl'],
        },
        tabBarLabelStyle: {
          fontFamily: fontFamily.body,
          fontWeight: fontWeight.medium,
          fontSize: fontSize.xs,
        },
        tabBarItemStyle: { paddingVertical: space.xs },
        tabBarButton: (props) => (
          <TabBarButton
            {...props}
            activeBackground={activeBackground}
            inactiveBackground={inactiveBackground}
            rippleColor={rippleColor ?? undefined}
          />
        ),
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
              size: iconSize,
            }: {
              color: string;
              focused: boolean;
              size: number;
            }) => (
              <TabBarIcon
                focused={focused}
                color={color}
                size={iconSize}
                icon={tab.icon}
                iconFocused={tab.iconFocused}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
