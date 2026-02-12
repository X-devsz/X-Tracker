/**
 * Settings Store — Zustand + AsyncStorage persistence
 *
 * Manages: theme mode, currency, onboarding flag.
 * Uses Zustand's built-in persist middleware with AsyncStorage.
 */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/storage/mmkv';

// ─── Types ─────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  themeMode: ThemeMode;
  currency: string;
  hasOnboarded: boolean;
}

interface SettingsActions {
  setThemeMode: (mode: ThemeMode) => void;
  setCurrency: (currency: string) => void;
  setHasOnboarded: (value: boolean) => void;
}

type SettingsStore = SettingsState & SettingsActions;

// ─── Store with async persistence ──────────────────────────
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      // Defaults (used until persisted state is hydrated)
      themeMode: 'system',
      currency: 'INR',
      hasOnboarded: false,

      setThemeMode: (mode) => set({ themeMode: mode }),
      setCurrency: (currency) => set({ currency }),
      setHasOnboarded: (value) => set({ hasOnboarded: value }),
    }),
    {
      name: 'expense-tracker-settings',
      storage: createJSONStorage(() => zustandStorage),
    },
  ),
);
