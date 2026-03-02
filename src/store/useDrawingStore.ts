// ============================================
// Drawing Store — Tool state, canvas data, persistence
// ============================================

import { create } from "zustand";
import type { DrawingTool } from "@/types/drawing.types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface DrawingState {
  activeTool: DrawingTool;
  penColor: string;
  highlightColor: string;
  penWidth: number;
  isToolbarOpen: boolean;
  canvasData: Record<number, string>;

  // Actions
  setTool: (tool: DrawingTool) => void;
  setPenColor: (color: string) => void;
  setHighlightColor: (color: string) => void;
  setPenWidth: (width: number) => void;
  saveCanvas: (pageNum: number, json: string) => void;
  clearCanvas: (pageNum: number) => void;
  toggleToolbar: () => void;
  getHighlightedPageCount: () => number;
}

export const useDrawingStore = create<DrawingState>((set, get) => ({
  activeTool: "none",
  penColor: "#000000",
  highlightColor: "#facc15",
  penWidth: 2,
  isToolbarOpen: false,
  canvasData: getStorageItem<Record<number, string>>("canvas_data", {}),

  setTool: (tool) => set({ activeTool: tool }),

  setPenColor: (color) => set({ penColor: color }),

  setHighlightColor: (color) => set({ highlightColor: color }),

  setPenWidth: (width) => set({ penWidth: width }),

  saveCanvas: (pageNum, json) => {
    set((s) => {
      const updated = { ...s.canvasData, [pageNum]: json };
      setStorageItem("canvas_data", updated);
      return { canvasData: updated };
    });
  },

  clearCanvas: (pageNum) => {
    set((s) => {
      const updated = { ...s.canvasData };
      delete updated[pageNum];
      setStorageItem("canvas_data", updated);
      return { canvasData: updated };
    });
  },

  toggleToolbar: () => set((s) => ({ isToolbarOpen: !s.isToolbarOpen })),

  getHighlightedPageCount: () => Object.keys(get().canvasData).length,
}));
