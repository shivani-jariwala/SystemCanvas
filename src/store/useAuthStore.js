/**
 * useAuthStore — Firebase-backed authentication state.
 *
 * Supports email/password, Google sign-in, registration,
 * forgot-password, and session persistence via Firebase.
 * Falls back to localStorage demo mode when Firebase is not configured.
 */
import { create } from 'zustand';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';

const AUTH_KEY = 'systemcanvas-auth-session';
const USERS_KEY = 'systemcanvas-users';

/** Check whether Firebase is configured with real credentials */
const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return key && key !== 'demo-api-key';
};

/** Save/load user profile to/from Firestore */
const saveUserProfile = async (user) => {
  if (!isFirebaseConfigured()) return;
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        uid: user.uid,
        name: user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
      });
    }
  } catch (e) {
    console.warn('Could not save user profile to Firestore:', e.message);
  }
};

const useAuthStore = create((set, get) => {
  /* ---- Restore session from localStorage (demo mode fallback) ---- */
  const storedUser = localStorage.getItem(AUTH_KEY);
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  /* ---- Listen for Firebase auth state changes ---- */
  if (isFirebaseConfigured()) {
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const sessionUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'User',
          photoURL: firebaseUser.photoURL || null,
          role: 'User',
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser, loading: false });
        saveUserProfile(firebaseUser);
      } else {
        localStorage.removeItem(AUTH_KEY);
        set({ isAuthenticated: false, user: null, loading: false });
      }
    });
  }

  return {
    isAuthenticated: !!initialUser,
    user: initialUser,
    loading: isFirebaseConfigured(), // true until onAuthStateChanged fires

    /* ---- Email / Password Login ---- */
    login: async (email, password) => {
      if (isFirebaseConfigured()) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
          return true;
        } catch (err) {
          return err.message.includes('invalid')
            ? 'Invalid email or password.'
            : err.message;
        }
      }
      // Demo mode fallback
      const usersStr = localStorage.getItem(USERS_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];
      if (email === 'admin' && password === 'admin123') {
        const sessionUser = { uid: 'demo-admin', email: 'admin', name: 'Admin User', role: 'Architect' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser });
        return true;
      }
      const user = users.find((u) => u.email === email && u.password === password);
      if (user) {
        const sessionUser = { uid: `demo-${user.email}`, email: user.email, name: user.name, role: 'User' };
        localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
        set({ isAuthenticated: true, user: sessionUser });
        return true;
      }
      return 'Invalid email or password.';
    },

    /* ---- Registration ---- */
    register: async (email, password, name) => {
      if (isFirebaseConfigured()) {
        try {
          const cred = await createUserWithEmailAndPassword(auth, email, password);
          await updateProfile(cred.user, { displayName: name });
          return true;
        } catch (err) {
          if (err.code === 'auth/email-already-in-use') return 'Email already in use.';
          if (err.code === 'auth/weak-password') return 'Password must be at least 6 characters.';
          return err.message;
        }
      }
      // Demo mode fallback
      const usersStr = localStorage.getItem(USERS_KEY);
      const users = usersStr ? JSON.parse(usersStr) : [];
      if (users.find((u) => u.email === email)) return 'Email already in use.';
      users.push({ email, password, name });
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      return true;
    },

    /* ---- Google Sign In ---- */
    loginWithGoogle: async () => {
      if (isFirebaseConfigured()) {
        try {
          await signInWithPopup(auth, googleProvider);
          return true;
        } catch (err) {
          if (err.code === 'auth/popup-closed-by-user') return 'Sign-in popup was closed.';
          return err.message;
        }
      }
      // Demo fallback — simulate Google login
      const sessionUser = { uid: 'demo-google', email: 'google@demo.com', name: 'Google User', role: 'User', photoURL: null };
      localStorage.setItem(AUTH_KEY, JSON.stringify(sessionUser));
      set({ isAuthenticated: true, user: sessionUser });
      return true;
    },

    /* ---- Forgot Password ---- */
    forgotPassword: async (email) => {
      if (isFirebaseConfigured()) {
        try {
          await sendPasswordResetEmail(auth, email);
          return true;
        } catch (err) {
          if (err.code === 'auth/user-not-found') return 'No account found with this email.';
          return err.message;
        }
      }
      // Demo mode: just succeed
      return true;
    },

    /* ---- Logout ---- */
    logout: async () => {
      if (isFirebaseConfigured()) {
        try {
          await signOut(auth);
        } catch (e) {
          console.warn('Sign out error:', e);
        }
      }
      localStorage.removeItem(AUTH_KEY);
      set({ isAuthenticated: false, user: null });
    },
  };
});

export default useAuthStore;
