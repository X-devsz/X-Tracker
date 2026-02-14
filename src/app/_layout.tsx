import '@expo/match-media';
import '../matchMediaPolyfill';

import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, useRouter, useSegments, SplashScreen, useRootNavigationState } from 'expo-router';
import { TamaguiProvider } from 'tamagui';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import config from '../theme/tamagui.config';
import { runMigrations } from '../db/client';
import { seedDefaultCategories } from '../db/seed';
import { useSettingsStore, useAuthStore } from '../store';
import { logColdStart } from '../services/performance';

// Keep splash screen visible while the app loads
SplashScreen.preventAutoHideAsync();

// Configure Google Sign-In immediately on app start
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  offlineAccess: true,
});

/**
 * A custom hook to protect routes based on authentication state.
 */
function useProtectedRoute(user: any, loading: boolean) {
  const segments = useSegments();
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key != null;

    // Don't navigate until navigation is ready and auth is loaded
    if (!isNavigationReady || loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // User is not signed in and not in the auth group, so redirect to login.
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // User is signed in but in the auth group, so redirect to the main app.
      router.replace('/(tabs)');
    }
  }, [user, segments, loading, rootNavigationState?.key, router]);
}

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useSettingsStore();
  const { user, loading, initialize } = useAuthStore();
  const rootNavigationState = useRootNavigationState();

  const activeTheme = themeMode === 'system'
    ? (systemColorScheme || 'light')
    : themeMode;

  // Initialize the authentication listener once
  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    const initDb = async () => {
      try {
        await runMigrations();
        await seedDefaultCategories();
      } catch (error) {
        console.error('[DB] Initialization failed:', error);
      }
    };

    initDb();
  }, []);

  // Use the protected route hook to handle navigation
  useProtectedRoute(user, loading);

  // Hide the splash screen once navigation is ready and auth is loaded
  useEffect(() => {
    const isNavigationReady = rootNavigationState?.key != null;
    if (!loading && isNavigationReady) {
      SplashScreen.hideAsync();
      logColdStart('navigation-ready');
    }
  }, [loading, rootNavigationState?.key]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme={activeTheme}>
        <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: 'transparent' },
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="expense"
            options={{
              presentation: 'modal',
              headerShown: false,
            }}
          />
        </Stack>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
