/**
 * Storage Service — AsyncStorage wrapper
 *
 * Replaces MMKV (requires native modules) with AsyncStorage
 * which works in Expo Go. Provides a Zustand-compatible
 * storage interface.
 *
 * NOTE: When migrating to a custom dev client, swap back to MMKV
 * for better performance (sync reads, faster writes).
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'system';

export const StorageKeys = {
  THEME_MODE: 'settings.themeMode',
  CURRENCY_CODE: 'settings.currencyCode',
  HAS_ONBOARDED: 'settings.hasOnboarded',
  LAST_USED_CATEGORY: 'settings.lastUsedCategory',
} as const;

/**
 * Zustand-compatible async storage adapter.
 * Used with `persist()` middleware.
 */
export const zustandStorage: StateStorage = {
  getItem: async (name: string) => {
    const value = await AsyncStorage.getItem(name);
    return value ?? null;
  },
  setItem: async (name: string, value: string) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name: string) => {
    await AsyncStorage.removeItem(name);
  },
};

/**
 * Convenience helpers for direct key-value access.
 */
export const appStorage = {
  getString: (key: string) => AsyncStorage.getItem(key),
  setString: (key: string, value: string) => AsyncStorage.setItem(key, value),
  getBoolean: async (key: string): Promise<boolean> => {
    const val = await AsyncStorage.getItem(key);
    return val === 'true';
  },
  setBoolean: (key: string, value: boolean) =>
    AsyncStorage.setItem(key, String(value)),
  delete: (key: string) => AsyncStorage.removeItem(key),
  clearAll: () => AsyncStorage.clear(),
};

export const settingsStorage = {
  getThemeMode: async (): Promise<ThemeMode> => {
    const value = await appStorage.getString(StorageKeys.THEME_MODE);
    if (value === 'light' || value === 'dark' || value === 'system') {
      return value;
    }
    return 'system';
  },
  setThemeMode: (mode: ThemeMode) =>
    appStorage.setString(StorageKeys.THEME_MODE, mode),
  getCurrencyCode: async (): Promise<string> =>
    (await appStorage.getString(StorageKeys.CURRENCY_CODE)) ?? 'INR',
  setCurrencyCode: (code: string) =>
    appStorage.setString(StorageKeys.CURRENCY_CODE, code),
  getHasOnboarded: () =>
    appStorage.getBoolean(StorageKeys.HAS_ONBOARDED),
  setHasOnboarded: (value: boolean) =>
    appStorage.setBoolean(StorageKeys.HAS_ONBOARDED, value),
  getLastUsedCategory: () =>
    appStorage.getString(StorageKeys.LAST_USED_CATEGORY),
  setLastUsedCategory: (id: string) =>
    appStorage.setString(StorageKeys.LAST_USED_CATEGORY, id),
  clearLastUsedCategory: () =>
    appStorage.delete(StorageKeys.LAST_USED_CATEGORY),
};
