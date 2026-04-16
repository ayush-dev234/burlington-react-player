// ============================================
// Book Configuration — Dynamic loader
// ============================================
// Loads config from public/data/config.json at runtime.
// This makes the player grade-agnostic — swap the JSON
// file to support any book/grade.
// ============================================
import type { BookConfig } from "@/types/book.types";
import configData from "../data/config.json"

let _config: BookConfig | null = null;

/**
 * Load book configuration from the external JSON file.
 * Must be called once at app startup before any component renders.
 */
export function  getBookConfig(): BookConfig {
  if (_config) return _config;

  _config = configData as BookConfig;

  return _config;
}