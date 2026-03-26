/**
 * useAuthStore — Simple client-side auth state management.
 * 
 * Persists session to localStorage.
 * Uses hardcoded demo credentials (admin / admin123).
 */
import { create } from 'zustand';

const AUTH_KEY = 'systemcanvas-auth-session';

const useAuthStore = create((set) => {
  // Check localStorage for existing session on load
  const storedUser = localStorage.getItem(AUTH_KEY);
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    isAuthenticated: !!initialUser,
    user: initialUser,

    login: (username, password) => {
      // Demo credentials validation
      if (username === 'admin' && password === 'admin123') {
        const user = { username, name: 'Admin User', role: 'Architect' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
        set({ isAuthenticated: true, user });
        return true;
      }
      return false;
    },

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set({ isAuthenticated: false, user: null });
    },
  };
});

export default useAuthStore;
