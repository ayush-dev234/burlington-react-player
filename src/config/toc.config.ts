import type { TOCEntry } from "@/types/book.types";
import tocData from "../data/toc.json";

export interface FullTOCData {
  toc: TOCEntry[];
  mediaToc?: any[];
  interactiveToc?: any[];
}

let _tocData: FullTOCData | null = null;

export function loadTocData(): FullTOCData {
  if (_tocData) return _tocData;

  _tocData = tocData as unknown as FullTOCData;

  return _tocData;
}

export function getTocData(): FullTOCData {
  if (!_tocData) {
    throw new Error("TOC data not loaded yet. Call loadTocData() first.");
  }
  return _tocData;
}