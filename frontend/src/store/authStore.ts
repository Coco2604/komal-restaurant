import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthStore {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setAuth: (user, token) => {
        localStorage.setItem('komal_token', token);
        set({ user, token });
      },

      logout: () => {
        localStorage.removeItem('komal_token');
        localStorage.removeItem('komal_user');
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token && !!get().user,

      isAdmin: () => get().user?.role === 'admin',
    }),
    { name: 'komal-auth' }
  )
);
