// ============================================
// Drawing Types — Canvas and drawing tool types
// ============================================

export type DrawingTool = "none" | "pen" | "highlighter";

export interface CanvasState {
  pageNum: number;
  data: string;   // Fabric.js JSON string
}

export interface DrawingPreset {
  name: string;
  color: string;
  width: number;
  opacity: number;
}

export const PEN_PRESETS: DrawingPreset[] = [
  { name: "Black", color: "#000000", width: 2, opacity: 1 },
  { name: "Red", color: "#ef4444", width: 2, opacity: 1 },
  { name: "Blue", color: "#3b82f6", width: 2, opacity: 1 },
  { name: "Green", color: "#22c55e", width: 2, opacity: 1 },
];

export const HIGHLIGHTER_PRESETS: DrawingPreset[] = [
  { name: "Yellow", color: "#facc15", width: 20, opacity: 0.4 },
  { name: "Green", color: "#4ade80", width: 20, opacity: 0.4 },
  { name: "Pink", color: "#f472b6", width: 20, opacity: 0.4 },
  { name: "Blue", color: "#60a5fa", width: 20, opacity: 0.4 },
];
