import type { TOCEntry } from "@/types/book.types";
import tocData from "../data/toc.json";

let _tocData: TOCEntry[] | null = null;

export function loadTocData(): TOCEntry[] {
  if (_tocData) return _tocData;

  _tocData = tocData.toc as TOCEntry[];

  return _tocData;
}

export function getTocData(): TOCEntry[] {
  if (!_tocData) {
    throw new Error("TOC data not loaded yet. Call loadTocData() first.");
  }
  return _tocData;
}