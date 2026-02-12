import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// CRITICAL: Import from 'tamagui' package ONLY, never from subpackages
import { TamaguiProvider, Theme } from 'tamagui';

import config from '../theme/tamagui.config';
import { useSettingsStore } from '../store';

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const { themeMode: userTheme } = useSettingsStore();
  
  const activeTheme = userTheme === 'system' 
    ? (systemColorScheme || 'light')
    : userTheme;

  return (
    <TamaguiProvider config={config} defaultTheme={activeTheme}>
      {/* Don't wrap in Theme here - TamaguiProvider handles it */}
      <StatusBar style={activeTheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: 'transparent' },
        }}
      >
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen 
          name="expense" 
          options={{
            presentation: 'modal',
          }}
        />
      </Stack>
    </TamaguiProvider>
  );
}
