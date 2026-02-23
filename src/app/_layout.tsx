import '@expo/match-media';
import '../matchMediaPolyfill';

import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Stack, SplashScreen } from 'expo-router';
import { TamaguiProvider } from '@tamagui/core';
import { PortalProvider } from '@tamagui/portal';
import { ToastProvider, ToastViewport } from '@tamagui/toast';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider as PaperProvider } from 'react-native-paper';
import { enGB, registerTranslation } from 'react-native-paper-dates';
import config from '../theme/tamagui.config';
import { useSettingsStore, useAuthStore } from '../store';
import { runMigrations } from '../db/client';
import { seedDefaultCategories } from '../db/seed';
import { AppToast } from '../components/organisms';

// ARCHITECTURE REFACTORED: This is the root layout.
// Its only job is to set up providers and render the navigator.
// It contains NO navigation logic.

registerTranslation('en-GB', enGB);

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
      <PaperProvider>
        <TamaguiProvider config={config} defaultTheme={activeTheme}>
          <PortalProvider shouldAddRootHost>
            <ToastProvider swipeDirection="up" duration={3000}>
              <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
              <Stack screenOptions={{ headerShown: false }} />
              <AppToast />
              <ToastViewport
                top={60}
                left={0}
                right={0}
                flexDirection="column"
                alignItems="center"
              />
            </ToastProvider>
          </PortalProvider>
        </TamaguiProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
