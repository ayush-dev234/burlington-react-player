// ============================================
// PageOverlay — Shows interactive icons on a page
// ============================================

import { useMemo } from "react";
import { getPageLinks } from "@/config/pages.config";
import type { InteractiveItem } from "@/types/book.types";
import InteractiveIcon from "./InteractiveIcon";

interface PageOverlayProps {
  pageNum: number;
  onItemClick: (item: InteractiveItem) => void;
}

export default function PageOverlay({
  pageNum,
  onItemClick,
}: PageOverlayProps) {
  const items = useMemo(() => {
    try {
      const allLinks = getPageLinks();
      return allLinks[String(pageNum)] || [];
    } catch {
      // Page links not loaded yet
      return [];
    }
  }, [pageNum]);

  if (items.length === 0) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {items.map((item, idx) => (
        <InteractiveIcon
          key={`${pageNum}-${idx}`}
          item={item}
          onClick={onItemClick}
        />
      ))}
    </div>
  );
}
