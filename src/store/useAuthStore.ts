import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '../services/storage/mmkv';
import type { AuthUser } from '../services/auth';
import { subscribeToAuthState } from '../services/auth';

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  initialize: () => () => void; // Returns the unsubscribe function
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,
      initialize: () => {
        const unsubscribe = subscribeToAuthState((user) => {
          set({ user, loading: false });
        });
        return unsubscribe;
      },
      setUser: (user) => set({ user }),
    }),
    {
      name: 'expense-tracker-auth',
      storage: createJSONStorage(() => zustandStorage),
      // onRehydrateStorage is not needed anymore as the listener will handle hydration
    }
  )
);
