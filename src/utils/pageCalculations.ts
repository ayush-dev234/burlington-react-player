// ============================================
// Page Calculation Utilities
// ============================================

import { getBookConfig } from "@/config/book.config";

/**
 * Clamp a page number to valid range [1, totalPages].
 */
export function clampPage(page: number, totalPages?: number): number {
  const max = totalPages ?? getBookConfig().totalPages;
  return Math.max(1, Math.min(page, max));
}

/**
 * Calculate the spread pages for double-page view.
 * For page N, the spread is [N, N+1] (if N is odd) or [N-1, N] (if N is even).
 * Page 1 (cover) is always shown alone.
 */
export function getSpreadPages(
  page: number,
  totalPages?: number
): [number, number | null] {
  const max = totalPages ?? getBookConfig().totalPages;

  if (page === 1) return [1, null];
  if (page === max && page % 2 === 0) return [page, null];

  if (page % 2 === 0) {
    return [page - 1, page];
  } else {
    const right = page + 1 <= max ? page + 1 : null;
    return [page, right];
  }
}

/**
 * Get the page image path.
 */
export function getPageImagePath(pageNum: number, ext?: string): string {
  const pageExt = ext ?? getBookConfig().pageExt;
  return `./resources/book/page_${pageNum}.${pageExt}`;
}

/**
 * Parse a size string like "1024x720" into width and height.
 */
export function parseSize(size: string): { width: number; height: number } {
  const [w, h] = size.split("x").map(Number);
  return { width: w ?? 1024, height: h ?? 720 };
}
