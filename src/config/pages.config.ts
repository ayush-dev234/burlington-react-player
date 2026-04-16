import type { PageLinks } from "@/types/book.types";
import pagesData from "../data/pages.json";

let _pageLinks: PageLinks | null = null;

export function loadPageLinks(): PageLinks {
  if (_pageLinks) return _pageLinks;

  _pageLinks = pagesData as PageLinks;

  return _pageLinks;
}

export function getPageLinks(): PageLinks {
  if (!_pageLinks) {
    throw new Error(
      "Page links not loaded yet. Call loadPageLinks() first."
    );
  }
  return _pageLinks;
}