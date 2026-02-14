# Tech Stack Setup — Package Installation & Configuration Guide

**Last updated:** 2026-02-11  
**Stack:** Expo + TypeScript + Tamagui + Drizzle ORM + Zustand + Firebase

---

## 1) Project Initialization

### 1.1 Create Expo Project

```bash
# Create new Expo project with TypeScript template
npx -y create-expo-app@latest expense-tracker --template blank-typescript

cd expense-tracker
```

### 1.2 Install Expo Router

```bash
npx expo install expo-router expo-linking expo-constants expo-status-bar
```

Update `app.json`:

```json
{
  "expo": {
    "scheme": "expense-tracker",
    "web": {
      "bundler": "metro"
    },
    "plugins": ["expo-router"]
  }
}
```

Update `package.json` entry point:

```json
{
  "main": "expo-router/entry"
}
```

---

## 2) UI System — Tamagui

### 2.1 Install Tamagui

```bash
npx expo install tamagui @tamagui/config @tamagui/babel-plugin
npx expo install @tamagui/font-inter
npx expo install @tamagui/themes
npx expo install @tamagui/animations-react-native
npx expo install react-native-reanimated
```

### 2.2 Babel Configuration

```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui'],
          config: './tamagui.config.ts',
          logTimings: true,
          disableExtraction: process.env.NODE_ENV === 'development',
        },
      ],
      'react-native-reanimated/plugin', // MUST be last
    ],
  };
};
```

### 2.3 Tamagui Config (Root)

```typescript
// tamagui.config.ts
import { config } from './src/theme/tamagui.config';
export default config;
export type Conf = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
```

---

## 3) Database — expo-sqlite + Drizzle ORM

### 3.1 Install SQLite + Drizzle

```bash
npx expo install expo-sqlite
npm install drizzle-orm
npm install -D drizzle-kit
```

### 3.2 Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/migrations',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;
```

### 3.3 Generate Migrations

```bash
# After defining/modifying schema files:
npx drizzle-kit generate

# Push schema (development only):
npx drizzle-kit push
```

---

## 4) Key-Value Storage — MMKV

```bash
npm install react-native-mmkv
```

Usage wrapper:

```typescript
// src/services/storage/mmkv.ts
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'expense-tracker-storage',
  encryptionKey: 'your-encryption-key', // optional
});

export const mmkvStorage = {
  getString: (key: string) => storage.getString(key),
  setString: (key: string, value: string) => storage.set(key, value),
  getBoolean: (key: string) => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean) => storage.set(key, value),
  delete: (key: string) => storage.delete(key),
  clearAll: () => storage.clearAll(),
};
```

---

## 5) State Management — Zustand

### 5.1 Install

```bash
npm install zustand
```

### 5.2 MMKV Persist Middleware

```typescript
// src/store/middleware/mmkvPersist.ts
import { StateStorage } from 'zustand/middleware';
import { storage } from '@/services/storage/mmkv';

export const mmkvStateStorage: StateStorage = {
  getItem: (name) => storage.getString(name) ?? null,
  setItem: (name, value) => storage.set(name, value),
  removeItem: (name) => storage.delete(name),
};
```

---

## 6) State — TanStack Query (Phase 2+)

```bash
npm install @tanstack/react-query
```

> **Note:** Not needed for MVP. Install when adding cloud sync/API calls.

---

## 7) Charts

### Option A (Recommended for premium feel)

```bash
npm install victory-native-xl
npx expo install react-native-svg
```

### Option B (More chart types, faster setup)

```bash
npm install react-native-gifted-charts
npx expo install react-native-svg react-native-linear-gradient
```

---

## 8) Animation — Reanimated

```bash
# Already installed with Tamagui, but ensure latest:
npx expo install react-native-reanimated
```

Enable new architecture in `app.json`:

```json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

---

## 9) Authentication — Firebase

### 9.1 Install Firebase

```bash
npm install firebase
npx expo install expo-auth-session expo-crypto expo-web-browser
```

### 9.2 Secure Token Storage

```bash
npx expo install expo-secure-store
```

### 9.3 Firebase Config

```typescript
// src/services/firebase/config.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
```

---

## 10) Additional Utilities

### 10.1 UUID Generation

```bash
npm install uuid
npm install -D @types/uuid
```

### 10.2 Date Handling

```bash
npm install date-fns
```

### 10.3 CSV Export

```bash
npm install papaparse
npm install -D @types/papaparse
npx expo install expo-file-system expo-sharing
```

### 10.4 Icons

```bash
npx expo install @expo/vector-icons
```

---

## 11) Development Tools

### 11.1 Linting & Formatting

```bash
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier eslint-plugin-react
npm install -D eslint-plugin-react-hooks eslint-plugin-import
```

### 11.2 Testing

```bash
npm install -D jest @testing-library/react-native
npm install -D @testing-library/jest-native
npm install -D ts-jest @types/jest
```

---

## 12) Environment Variables

```bash
# .env.example
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

---

## 13) EAS Build Configuration

```json
// eas.json
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_ENV": "development"
      }
    },
    "preview": {
      "distribution": "internal",
      "env": {
        "APP_ENV": "staging"
      }
    },
    "production": {
      "env": {
        "APP_ENV": "production"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 14) TypeScript Configuration

```json
// tsconfig.json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "types": ["@types/jest"]
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  "exclude": ["node_modules"]
}
```

---

## 15) Complete Install Script (One Command)

```bash
# Foundation
npx -y create-expo-app@latest expense-tracker --template blank-typescript
cd expense-tracker

# Expo Router
npx expo install expo-router expo-linking expo-constants expo-status-bar

# Tamagui + UI
npx expo install tamagui @tamagui/config @tamagui/babel-plugin @tamagui/font-inter @tamagui/themes @tamagui/animations-react-native react-native-reanimated

# Database
npx expo install expo-sqlite
npm install drizzle-orm
npm install -D drizzle-kit

# Storage
npm install react-native-mmkv

# State
npm install zustand

# Charts
npm install victory-native-xl
npx expo install react-native-svg

# Auth
npm install firebase
npx expo install expo-auth-session expo-crypto expo-web-browser expo-secure-store

# Utilities
npm install uuid date-fns papaparse
npm install -D @types/uuid @types/papaparse
npx expo install expo-file-system expo-sharing @expo/vector-icons

# Dev tools
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin prettier eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-import jest @testing-library/react-native @testing-library/jest-native ts-jest @types/jest
```
