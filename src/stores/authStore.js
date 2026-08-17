import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { loginApi, logoutApi, meApi, signupApi } from '../lib/api/auth';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,

      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await loginApi(credentials);
          set({ token, user, loading: false });
          return user;
        } catch (err) {
          set({ error: err.message || 'Login failed', loading: false });
          throw err;
        }
      },

      signup: async (payload) => {
        set({ loading: true, error: null });
        try {
          const { token, user } = await signupApi(payload);
          set({ token, user, loading: false });
          return user;
        } catch (err) {
          set({ error: err.message || 'Signup failed', loading: false });
          throw err;
        }
      },

      logout: async () => {
        await logoutApi();
        set({ user: null, token: null, error: null });
      },

      setUser: (user) => set({ user }),

      restoreUser: async () => {
        const { token, user } = get();
        if (!token || user) return;
        try {
          const fresh = await meApi(token);
          set({ user: fresh, error: null });
        } catch {
          set({ user: null, token: null });
        }
      },
    }),
    { name: 'nyayaai-auth' },
  ),
);
