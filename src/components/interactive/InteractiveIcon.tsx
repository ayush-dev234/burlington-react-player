// ============================================
// InteractiveIcon — Clickable icon on a page
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
        transition-all duration-300 hover:scale-110 active:scale-100"
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        width: 32,
        height: 32,
        filter: hovered
          ? "brightness(0.6) sepia(1) saturate(5) hue-rotate(10deg)"
          : "none",
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(item);
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={item.title}
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
