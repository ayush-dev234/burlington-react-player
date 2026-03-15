// ============================================
// Bookmark Store — Toggle, list, persist
// ============================================

import { create } from "zustand";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface BookmarkState {
  bookmarks: number[];

  // Actions
  toggleBookmark: (page: number) => void;
  isBookmarked: (page: number) => boolean;
  totalCount: () => number;
  /** Re-read bookmarks from localStorage (call after STORAGE_PREFIX is set) */
  rehydrate: () => void;
}

function persistBookmarks(bookmarks: number[]): void {
  setStorageItem("bookmarks", bookmarks);
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: getStorageItem<number[]>("bookmarks", []),

  toggleBookmark: (page) => {
    set((s) => {
      const exists = s.bookmarks.includes(page);
      const updated = exists
        ? s.bookmarks.filter((p) => p !== page)
        : [...s.bookmarks, page].sort((a, b) => a - b);
      persistBookmarks(updated);
      return { bookmarks: updated };
    });
  },

  isBookmarked: (page) => get().bookmarks.includes(page),

  totalCount: () => get().bookmarks.length,

  rehydrate: () => {
    const fresh = getStorageItem<number[]>("bookmarks", []);
    set({ bookmarks: fresh });
  },
}));
