// ============================================
// Book Types — Core domain types for the e-book reader
// ============================================

export interface BookConfig {
  subject: string;
  class: string;
  id: string;
  totalPages: number;
  bookWidth: number;
  bookHeight: number;
  pageExt: "webp" | "png" | "jpg";
}

export interface TOCEntry {
  title: string;
  page: number;
  unit?: number;
  isUnitHeader?: boolean;
}

export interface InteractiveItem {
  x: string;       // percentage from left
  y: string;       // percentage from top
  width?: string;
  height?: string;
  title: string;
  icon: string;    // Lucide icon name
  link: string;
  type: "iframe" | "video" | "audio";
  size: string;    // "1024x720"
}

export type PageLinks = Record<string, InteractiveItem[]>;
