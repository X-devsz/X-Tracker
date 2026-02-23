import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isSecureStoreAvailable = Platform.OS !== 'web';

const AUTH_TOKEN_KEY = 'auth.token';

export const secureAuthStorage = {
  getItem: async (key: string) => {
    if (!isSecureStoreAvailable) {
      return null;
    }
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (!isSecureStoreAvailable) {
      return;
    }
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  removeItem: async (key: string) => {
    if (!isSecureStoreAvailable) {
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

export const setAuthToken = async (token: string | null) => {
  if (!isSecureStoreAvailable) {
    return;
  }
  if (!token) {
    await SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
    return;
  }
  await SecureStore.setItemAsync(AUTH_TOKEN_KEY, token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};
