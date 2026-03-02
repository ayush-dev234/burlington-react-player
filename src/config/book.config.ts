// ============================================
// Book Configuration — Dynamic loader
// ============================================
// Loads config from public/data/config.json at runtime.
// This makes the player grade-agnostic — swap the JSON
// file to support any book/grade.
// ============================================

import type { BookConfig } from "@/types/book.types";

let _config: BookConfig | null = null;

/**
 * Load book configuration from the external JSON file.
 * Must be called once at app startup before any component renders.
 */
export async function loadBookConfig(): Promise<BookConfig> {
  if (_config) return _config;

  const res = await fetch("/data/config.json");
  if (!res.ok) throw new Error(`Failed to load book config: ${res.status}`);
  _config = (await res.json()) as BookConfig;
  return _config;
}

/**
 * Get the already-loaded book configuration.
 * Throws if loadBookConfig() hasn't been called yet.
 */
export function getBookConfig(): BookConfig {
  if (!_config) {
    throw new Error(
      "Book config not loaded yet. Call loadBookConfig() first."
    );
  }
  return _config;
}

/**
 * Fallback default config (used only if JSON fetch fails).
 */
export const defaultBookConfig: BookConfig = {
  subject: "E-Book",
  class: "",
  id: "default",
  totalPages: 1,
  bookWidth: 1305,
  bookHeight: 1710,
  pageExt: "webp",
};
