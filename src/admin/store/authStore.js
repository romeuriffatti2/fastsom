import { create } from 'zustand';
import api from '../services/api';

export const useAuthStore = create((set, get) => ({
  user: null,
  isInitialized: false,
  isLoading: false,

  setUser: (user) => set({ user }),

  clearAuth: () => {
    // Garantir limpeza total de qualquer resíduo prévio em storage
    localStorage.removeItem('fastsom-admin-auth');
    sessionStorage.clear();
    set({ user: null, isInitialized: true, isLoading: false });
  },

  checkAuth: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });

    try {
      const response = await api.get('/auth/me');
      if (response.data.success && response.data.data?.user) {
        set({ user: response.data.data.user, isInitialized: true, isLoading: false });
        return true;
      }
    } catch {
      // Se falhar o /auth/me, tentar o refresh
      try {
        const refreshResponse = await api.post('/auth/refresh');
        if (refreshResponse.data.success && refreshResponse.data.data?.user) {
          set({ user: refreshResponse.data.data.user, isInitialized: true, isLoading: false });
          return true;
        }
      } catch {
        get().clearAuth();
        return false;
      }
    }

    get().clearAuth();
    return false;
  },

  login: async (email, senha) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/auth/login', { email, senha });
      const user = response.data.data.user;
      set({ user, isInitialized: true, isLoading: false });
      return { success: true, user };
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignora erro ao fazer logout no server
    } finally {
      get().clearAuth();
    }
  },
}));
