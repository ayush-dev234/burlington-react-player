// ============================================
// Settings Store — Sound, music, theme preferences
// ============================================
// Bug fix: toggleMusic is properly implemented here.
// Original had the function commented out but still called.
// ============================================

import { create } from "zustand";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface SettingsState {
  soundEnabled: boolean;
  musicEnabled: boolean;
  musicVolume: number;
  theme: "light" | "dark";

  // Actions
  toggleSound: () => void;
  toggleMusic: () => void;
  setVolume: (v: number) => void;
  setTheme: (t: "light" | "dark") => void;
}

const savedSettings = getStorageItem<
  Partial<Omit<SettingsState, "toggleSound" | "toggleMusic" | "setVolume" | "setTheme">>
>("settings", {});

function persistSettings(state: Partial<SettingsState>): void {
  const current = getStorageItem<Record<string, unknown>>("settings", {});
  setStorageItem("settings", { ...current, ...state });
}

export const useSettingsStore = create<SettingsState>((set) => ({
  soundEnabled: savedSettings.soundEnabled ?? true,
  musicEnabled: savedSettings.musicEnabled ?? false,
  musicVolume: savedSettings.musicVolume ?? 0.5,
  theme: savedSettings.theme ?? "light",

  toggleSound: () =>
    set((s) => {
      const next = !s.soundEnabled;
      persistSettings({ soundEnabled: next });
      return { soundEnabled: next };
    }),

  toggleMusic: () =>
    set((s) => {
      const next = !s.musicEnabled;
      persistSettings({ musicEnabled: next });
      return { musicEnabled: next };
    }),

  setVolume: (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    set({ musicVolume: clamped });
    persistSettings({ musicVolume: clamped });
  },

  setTheme: (t) => {
    set({ theme: t });
    persistSettings({ theme: t });

    // Toggle dark class on document root
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },
}));
