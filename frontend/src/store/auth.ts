import { create } from 'zustand';
import { User } from '../types';
import { authService } from '../lib/authService';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  }
}));