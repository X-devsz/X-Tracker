import '@expo/match-media';
import '../matchMediaPolyfill';

import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { TamaguiProvider } from '@tamagui/core';
import { PortalProvider } from '@tamagui/portal';
import { StatusBar } from 'expo-status-bar';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import config from '../theme/tamagui.config';
import { useSettingsStore, useAuthStore } from '../store';
import { runMigrations } from '../db/client';
import { seedDefaultCategories } from '../db/seed';

// ARCHITECTURE REFACTORED: This is the root layout.
// Its only job is to set up providers and render the navigator.
// It contains NO navigation logic.

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode } = useSettingsStore();
  const { loading, initialize } = useAuthStore();

  const activeTheme = themeMode === 'system'
    ? (systemColorScheme || 'light')
    : themeMode;

  // Initialize listeners and DB on app start.
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true,
    });

    const unsubscribe = initialize();

    const initDb = async () => {
      try {
        await runMigrations();
        await seedDefaultCategories();
      } catch (error) {
        console.error('[DB] Initialization failed:', error);
      }
    };
    initDb();

    return unsubscribe;
  }, [initialize]);

  // Hide the splash screen once auth is no longer loading.
  useEffect(() => {
    if (!loading) {
      SplashScreen.hideAsync();
    }
  }, [loading]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={config} defaultTheme={activeTheme}>
        <PortalProvider shouldAddRootHost>
          <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
          <Stack screenOptions={{ headerShown: false }} />
        </PortalProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
