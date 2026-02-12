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
