// ============================================
// UI Store — Sidebar, modals, panels, preloader
// ============================================

import { create } from "zustand";

type ModalType =
  | "notes"
  | "spotlight"
  | "activity"
  | "video"
  | "print"
  | "shortcuts"
  | "thumbnail"
  | null;

interface UIState {
  isSidebarOpen: boolean;
  isToolbarVisible: boolean;
  isBookOnlyMode: boolean;
  isPreloaderVisible: boolean;
  isThumbnailStripVisible: boolean;
  activeModal: ModalType;

  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setBookOnlyMode: (on: boolean) => void;
  toggleBookOnly: () => void;
  setPreloaderVisible: (visible: boolean) => void;
  setActiveModal: (modal: ModalType) => void;
  toggleThumbnailStrip: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  isToolbarVisible: true,
  isBookOnlyMode: false,
  isPreloaderVisible: true,
  isThumbnailStripVisible: false,
  activeModal: null,

  toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

  setSidebarOpen: (open) => set({ isSidebarOpen: open }),

  setBookOnlyMode: (on) =>
    set({
      isBookOnlyMode: on,
      isToolbarVisible: !on,
    }),

  toggleBookOnly: () =>
    set((s) => ({
      isBookOnlyMode: !s.isBookOnlyMode,
      isToolbarVisible: s.isBookOnlyMode,
    })),

  setPreloaderVisible: (visible) => set({ isPreloaderVisible: visible }),

  setActiveModal: (modal) => set({ activeModal: modal }),

  toggleThumbnailStrip: () =>
    set((s) => ({ isThumbnailStripVisible: !s.isThumbnailStripVisible })),
}));
