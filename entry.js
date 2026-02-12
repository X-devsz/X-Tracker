// entry.js - This runs BEFORE anything else
import '@expo/match-media';
import './src/matchMediaPolyfill';

// Now load expo-router
import 'expo-router/entry';
