// ============================================
// InteractiveIcon — Clickable icon on a page
// ============================================
// Responsive: larger tap area on mobile,
// hover glow on desktop, pulse animation,
// tooltip label for accessibility.
// ============================================

import { useState } from "react";
import type { InteractiveItem } from "@/types/book.types";

// Map icon types to SVG paths in public/img/icons/
const ICON_SRC_MAP: Record<string, string> = {
  puzzle: "/img/icons/interactivites.svg",
  video: "/img/icons/video.svg",
};

interface InteractiveIconProps {
  item: InteractiveItem;
  onClick: (item: InteractiveItem) => void;
}

export default function InteractiveIcon({
  item,
  onClick,
}: InteractiveIconProps) {
  const [hovered, setHovered] = useState(false);
  const iconSrc = ICON_SRC_MAP[item.icon] || ICON_SRC_MAP.puzzle;

  return (
    <button
      className="absolute z-30 flex items-center justify-center cursor-pointer pointer-events-auto
        transition-all duration-300 hover:scale-125 active:scale-100 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1 rounded-full"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        // Larger effective tap area — min 40px for mobile accessibility
        width: 40,
        height: 40,
        // The icon itself stays 32×32 visually
        padding: 4,
        filter: hovered
          ? "brightness(0.6) sepia(1) saturate(5) hue-rotate(10deg) drop-shadow(0 0 6px rgba(255,200,0,0.6))"
          : "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(item);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.title}
      aria-label={item.title}
    >
      <img
        src={iconSrc}
        alt={item.title}
        className="w-full h-full object-contain pointer-events-none"
        draggable={false}
      />
    </button>
  );
}
