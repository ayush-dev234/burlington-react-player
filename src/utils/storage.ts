// ============================================
// localStorage Helpers
// ============================================

import { STORAGE_PREFIX } from "./constants";

/**
 * Build a namespaced storage key.
 */
function buildKey(key: string): string {
  return `${STORAGE_PREFIX}_${key}`;
}

/**
 * Get an item from localStorage, parsed from JSON.
 * Returns `defaultValue` if the key doesn't exist or parsing fails.
 */
export function getStorageItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(buildKey(key));
    if (raw === null) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

/**
 * Set an item in localStorage as JSON.
 */
export function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(buildKey(key), JSON.stringify(value));
  } catch (e) {
    console.warn(`[Storage] Failed to save key "${key}":`, e);
  }
}

/**
 * Remove an item from localStorage.
 */
export function removeStorageItem(key: string): void {
  localStorage.removeItem(buildKey(key));
}

/**
 * Clear all items with our storage prefix.
 */
export function clearAllStorage(): void {
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach((k) => localStorage.removeItem(k));
}
