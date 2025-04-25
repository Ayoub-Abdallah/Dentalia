import { create } from 'zustand';
import { authService } from '../services/authService';
import type { LoginCredentials } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  error: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkAuth: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  error: null,
  isLoading: false,

  initialize: () => {
    authService.initializeAuth();
    const user = authService.getUser();
    set({ 
      isAuthenticated: authService.isAuthenticated(),
      user 
    });
  },

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(credentials);
      set({ 
        isAuthenticated: true, 
        user: response.user, 
        error: null 
      });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Login failed' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: () => {
    authService.logout();
    set({ isAuthenticated: false, user: null, error: null });
  },

  checkAuth: () => {
    const isAuthenticated = authService.isAuthenticated();
    const user = authService.getUser();
    set({ isAuthenticated, user });
  }
})); 