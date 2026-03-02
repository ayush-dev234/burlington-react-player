// ============================================
// Table of Contents — Dynamic loader
// ============================================
// Loads TOC from public/data/toc.json at runtime.
// ============================================

import type { TOCEntry } from "@/types/book.types";

let _tocData: TOCEntry[] | null = null;

/**
 * Load TOC data from the external JSON file.
 */
export async function loadTocData(): Promise<TOCEntry[]> {
  if (_tocData) return _tocData;

  const res = await fetch("/data/toc.json");
  if (!res.ok) throw new Error(`Failed to load TOC data: ${res.status}`);
  _tocData = (await res.json()) as TOCEntry[];
  return _tocData;
}

/**
 * Get the already-loaded TOC data.
 */
export function getTocData(): TOCEntry[] {
  if (!_tocData) {
    throw new Error("TOC data not loaded yet. Call loadTocData() first.");
  }
  return _tocData;
}
