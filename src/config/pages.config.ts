// ============================================
// Page Interactive Elements — Dynamic loader
// ============================================
// Loads page links from public/data/pages.json at runtime.
// ============================================

import type { PageLinks } from "@/types/book.types";

let _pageLinks: PageLinks | null = null;

/**
 * Load page links data from the external JSON file.
 */
export async function loadPageLinks(): Promise<PageLinks> {
  if (_pageLinks) return _pageLinks;

  const res = await fetch("/data/pages.json");
  if (!res.ok) throw new Error(`Failed to load page links: ${res.status}`);
  _pageLinks = (await res.json()) as PageLinks;
  return _pageLinks;
}

/**
 * Get the already-loaded page links data.
 */
export function getPageLinks(): PageLinks {
  if (!_pageLinks) {
    throw new Error(
      "Page links not loaded yet. Call loadPageLinks() first."
    );
  }
  return _pageLinks;
}
