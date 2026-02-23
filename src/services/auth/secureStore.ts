import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isSecureStoreAvailable = Platform.OS !== 'web';

const AUTH_TOKEN_KEY = 'auth.token';

const hashKey = (value: string) => {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 33) ^ value.charCodeAt(i);
  }
  return (hash >>> 0).toString(16);
};

const toSecureKey = (key: string) =>
  key ? `securestore_${hashKey(key)}` : 'securestore_empty';

export const secureAuthStorage = {
  getItem: async (key: string) => {
    if (!isSecureStoreAvailable) {
      return null;
    }
    try {
      return await SecureStore.getItemAsync(toSecureKey(key));
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    if (!isSecureStoreAvailable) {
      return;
    }
    await SecureStore.setItemAsync(toSecureKey(key), value, {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
    });
  },
  removeItem: async (key: string) => {
    if (!isSecureStoreAvailable) {
      return;
    }
    await SecureStore.deleteItemAsync(toSecureKey(key));
  },
};

export const setAuthToken = async (token: string | null) => {
  if (!isSecureStoreAvailable) {
    return;
  }
  if (!token) {
    await SecureStore.deleteItemAsync(toSecureKey(AUTH_TOKEN_KEY));
    return;
  }
  await SecureStore.setItemAsync(toSecureKey(AUTH_TOKEN_KEY), token, {
    keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK,
  });
};
