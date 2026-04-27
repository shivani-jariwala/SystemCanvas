/**
 * useToolUsageStore — Track recently used tools and favorites.
 *
 * Persists to localStorage per-user for "Recently Used" sidebar section
 * and pinned favorites.
 */
import { create } from 'zustand';

const RECENT_KEY = 'systemcanvas-recent-tools';
const FAVORITES_KEY = 'systemcanvas-favorite-tools';
const MAX_RECENT = 8;

const loadList = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const useToolUsageStore = create((set, get) => ({
  recentTools: loadList(RECENT_KEY),
  favorites: loadList(FAVORITES_KEY),

  /** Record a tool usage — moves it to the top of recent list */
  addRecentTool: (type) => {
    set((state) => {
      const filtered = state.recentTools.filter((t) => t !== type);
      const updated = [type, ...filtered].slice(0, MAX_RECENT);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return { recentTools: updated };
    });
  },

  /** Toggle a tool as favorite/pinned */
  toggleFavorite: (type) => {
    set((state) => {
      const isFav = state.favorites.includes(type);
      const updated = isFav
        ? state.favorites.filter((t) => t !== type)
        : [...state.favorites, type];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return { favorites: updated };
    });
  },

  /** Check if a tool is favorited */
  isFavorite: (type) => get().favorites.includes(type),
}));

export default useToolUsageStore;
