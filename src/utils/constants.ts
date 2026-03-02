// ============================================
// App-wide Constants
// ============================================

/** Static prefix for use in module-level initialization */
export let STORAGE_PREFIX = "ebook_default";

/** Called after config loads to update the storage prefix */
export function initStoragePrefix(bookId: string): void {
  STORAGE_PREFIX = `ebook_${bookId}`;
}

/** Maximum zoom level */
export const MAX_ZOOM = 3;

/** Minimum zoom level */
export const MIN_ZOOM = 0.5;

/** Zoom step increment */
export const ZOOM_STEP = 0.25;

/** Default page flip sound duration (ms) */
export const PAGE_FLIP_DURATION = 600;

/** Preloader minimum display time (ms) */
export const PRELOADER_MIN_TIME = 2000;

/** Number of pages to prefetch ahead */
export const PREFETCH_PAGES = 2;

/** Debounce delay for zoom (ms) */
export const ZOOM_DEBOUNCE = 150;

/** Mobile breakpoint (px) */
export const MOBILE_BREAKPOINT = 768;

/** Tablet breakpoint (px) */
export const TABLET_BREAKPOINT = 1024;

/** Desktop breakpoint (px) */
export const DESKTOP_BREAKPOINT = 1280;

/** Default page aspect ratio (width / height). Updated after config loads. */
export let PAGE_ASPECT_RATIO = 1305 / 1710;

/** Called after config loads to update the aspect ratio */
export function initPageAspectRatio(width: number, height: number): void {
  PAGE_ASPECT_RATIO = width / height;
}
