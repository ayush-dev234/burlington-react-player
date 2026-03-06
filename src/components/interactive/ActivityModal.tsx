// ============================================
// ActivityModal — Iframe modal for HTML activities
// ============================================
// Mimics the original Burlington player:
// - Blue header bar with title, fullscreen toggle, and close button
// - No dark backdrop shadow — clean white modal
// - Takes up most of the viewport
// - Close with X or Escape key

import { useEffect, useCallback, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { parseSize } from "@/utils/pageCalculations";

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  title: string;
  size: string; // "1024x720"
}

export default function ActivityModal({
  isOpen,
  onClose,
  link,
  title,
  size,
}: ActivityModalProps) {
  const { width, height } = parseSize(size);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isFullscreen) {
          setIsFullscreen(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, isFullscreen],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // Reset fullscreen when modal closes
  useEffect(() => {
    if (!isOpen) setIsFullscreen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "transparent" }}
    >
      <div
        className="relative flex flex-col bg-white shadow-2xl overflow-hidden transition-all duration-300"
        style={
          isFullscreen
            ? {
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }
            : {
                width: Math.min(width + 2, window.innerWidth - 20),
                height: Math.min(height + 42, window.innerHeight - 20),
                maxWidth: "96vw",
                maxHeight: "96vh",
                borderRadius: 8,
              }
        }
      >
        {/* Header bar — matches Burlington player style */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#2962A5] to-[#3776C4] px-3 py-1.5 text-white shrink-0">
          <div className="flex items-center gap-2">
            <img
              src="/img/icons/interactivites.svg"
              alt=""
              className="w-5 h-5 brightness-0 invert"
              draggable={false}
            />
            <h3 className="text-sm font-semibold truncate">{title}</h3>
          </div>

          <div className="flex items-center gap-1">
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="flex h-7 w-7 items-center justify-center rounded text-white/80 transition-all hover:bg-white/20 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded text-white/80 transition-all hover:bg-red-500 hover:text-white"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Iframe content */}
        <div className="flex-1 bg-white overflow-hidden">
          <iframe
            src={`/${link}`}
            title={title}
            className="h-full w-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
