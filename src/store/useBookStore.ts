// ============================================
// Book Store — Page navigation, zoom, view mode
// ============================================

import { create } from "zustand";
import { clampPage } from "@/utils/pageCalculations";
import { getStorageItem, setStorageItem } from "@/utils/storage";
import { MAX_ZOOM, MIN_ZOOM, ZOOM_STEP } from "@/utils/constants";

interface BookState {
  currentPage: number;
  viewMode: "single" | "double";
  zoomLevel: number;
  totalPages: number;
  isConfigLoaded: boolean;

  // Actions
  initialize: (totalPages: number) => void;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setViewMode: (mode: "single" | "double") => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
}

export const useBookStore = create<BookState>((set, get) => ({
  currentPage: 1,
  viewMode: "double",
  zoomLevel: 1,
  totalPages: 1,
  isConfigLoaded: false,

  initialize: (totalPages) => {
    const savedPage = getStorageItem<number>("last_page", 1);
    const clamped = clampPage(savedPage, totalPages);
    set({
      totalPages,
      currentPage: clamped,
      isConfigLoaded: true,
    });
  },

  setPage: (page) => {
    const { totalPages } = get();
    const clamped = clampPage(page, totalPages);
    set({ currentPage: clamped });
    setStorageItem("last_page", clamped);
  },

  nextPage: () => {
    const { currentPage, viewMode, totalPages } = get();
    const step = viewMode === "double" ? 2 : 1;
    const next = Math.min(currentPage + step, totalPages);
    get().setPage(next);
  },

  prevPage: () => {
    const { currentPage, viewMode } = get();
    const step = viewMode === "double" ? 2 : 1;
    const prev = Math.max(currentPage - step, 1);
    get().setPage(prev);
  },

  setViewMode: (mode) => set({ viewMode: mode }),

  zoomIn: () =>
    set((s) => ({
      zoomLevel: Math.min(s.zoomLevel + ZOOM_STEP, MAX_ZOOM),
    })),

  zoomOut: () =>
    set((s) => ({
      zoomLevel: Math.max(s.zoomLevel - ZOOM_STEP, MIN_ZOOM),
    })),

  resetZoom: () => set({ zoomLevel: 1 }),
}));
