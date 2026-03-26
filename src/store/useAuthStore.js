/**
 * useAuthStore — Client-side auth state management with registration.
 * 
 * Persists active session to 'systemcanvas-auth-session'.
 * Persists registered users to 'systemcanvas-users' to simulate a database.
 */
import { create } from 'zustand';

const AUTH_KEY = 'systemcanvas-auth-session';
const USERS_KEY = 'systemcanvas-users';

const useAuthStore = create((set, get) => {
  const storedUser = localStorage.getItem(AUTH_KEY);
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    isAuthenticated: !!initialUser,
    user: initialUser,

    // Return true if successful, string error otherwise
    login: (username, password) => {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      // Fallback for demo purposes if no users are registered yet
      if (users.length === 0 && username === 'admin' && password === 'admin123') {
        const sessionUser = { username: 'admin', name: 'Admin User', role: 'Architect' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser });
        return true;
      }

      const user = users.find(u => u.username === username && u.password === password);
      
      if (user) {
        // Omit password from session storage
        const sessionUser = { username: user.username, name: user.name, role: 'User' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser });
        return true;
      }
      return 'Invalid username or password.';
    },

    register: (username, password, name) => {
      const usersStr = localStorage.getItem(USERS_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];
      
      if (users.find(u => u.username === username)) {
        return 'Username already exists.';
      }

      users.push({ username, password, name });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      
      return true; // Registration successful
    },

    logout: () => {
      localStorage.removeItem(AUTH_KEY);
      set({ isAuthenticated: false, user: null });
    },
  };
});

export default useAuthStore;
