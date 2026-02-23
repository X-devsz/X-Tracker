// entry.js - This runs BEFORE anything else
import 'react-native-gesture-handler';
import '@expo/match-media';
import './src/matchMediaPolyfill';
import './src/crypto';

// Now load expo-router
import 'expo-router/entry';
