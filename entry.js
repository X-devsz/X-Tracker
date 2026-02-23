// entry.js - This runs BEFORE anything else
import 'react-native-gesture-handler';
import '@expo/match-media';
import './src/matchMediaPolyfill';
import './src/crypto';

if (globalThis?.__APP_START_TIME__ == null) {
  globalThis.__APP_START_TIME__ =
    typeof globalThis?.performance?.now === 'function'
      ? globalThis.performance.now()
      : Date.now();
}

// Now load expo-router
import 'expo-router/entry';
