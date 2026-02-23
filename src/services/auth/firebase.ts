import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth } from 'firebase/auth';
import { secureAuthStorage } from './secureStore';

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const getConfigFromEnv = (): Partial<FirebaseConfig> => ({
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
});

const getConfigFromExtra = (): Partial<FirebaseConfig> => {
  const extra = Constants.expoConfig?.extra ?? {};
  return {
    apiKey: extra.firebaseApiKey,
    authDomain: extra.firebaseAuthDomain,
    projectId: extra.firebaseProjectId,
    storageBucket: extra.firebaseStorageBucket,
    messagingSenderId: extra.firebaseMessagingSenderId,
    appId: extra.firebaseAppId,
  };
};

const resolveFirebaseConfig = (): FirebaseConfig | null => {
  const envConfig = getConfigFromEnv();
  const extraConfig = getConfigFromExtra();
  const config: Partial<FirebaseConfig> = {
    apiKey: envConfig.apiKey ?? extraConfig.apiKey,
    authDomain: envConfig.authDomain ?? extraConfig.authDomain,
    projectId: envConfig.projectId ?? extraConfig.projectId,
    storageBucket: envConfig.storageBucket ?? extraConfig.storageBucket,
    messagingSenderId:
      envConfig.messagingSenderId ?? extraConfig.messagingSenderId,
    appId: envConfig.appId ?? extraConfig.appId,
  };

  const missing = Object.entries(config).filter(([, value]) => !value);
  if (missing.length > 0) {
    return null;
  }

  return config as FirebaseConfig;
};

let cachedAuth: ReturnType<typeof getAuth> | null = null;

const createAuth = (app: ReturnType<typeof initializeApp>) => {
  if (Platform.OS === 'web') {
    return getAuth(app);
  }

  try {
    return initializeAuth(app, {
      persistence: getReactNativePersistence(secureAuthStorage),
    });
  } catch (error) {
    return getAuth(app);
  }
};

export const getFirebaseAuth = () => {
  if (cachedAuth) {
    return cachedAuth;
  }

  const config = resolveFirebaseConfig();
  if (!config) {
    return null;
  }

  const app = getApps().length ? getApps()[0] : initializeApp(config);
  cachedAuth = createAuth(app);

  return cachedAuth;
};
