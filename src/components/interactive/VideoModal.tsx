// ============================================
// VideoModal — Video playback modal (half-screen default)
// ============================================

import { useEffect, useCallback, useRef, useState } from "react";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { parseSize } from "@/utils/pageCalculations";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  title: string;
  size: string; // "1024x720"
}

export default function VideoModal({
  isOpen,
  onClose,
  link,
  title,
  size,
}: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
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

  // Auto-pause on close
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  // Reset fullscreen when modal closes
  useEffect(() => {
    if (!isOpen) setIsFullscreen(false);
  }, [isOpen]);

  if (!isOpen) return null;

  // Half-screen dimensions by default
  const halfWidth = Math.min(width * 0.7, window.innerWidth * 0.5);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-gray-900 shadow-2xl overflow-hidden transition-all duration-300"
        style={
          isFullscreen
            ? {
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
              }
            : {
                width: halfWidth,
                maxWidth: "90vw",
                maxHeight: "90vh",
                borderRadius: 8,
              }
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 text-white shrink-0 bg-gray-900">
          <div className="flex items-center gap-2">
            <img
              src="/img/icons/video.svg"
              alt=""
              className="w-5 h-5"
              draggable={false}
            />
            <h3 className="text-sm font-medium truncate text-gray-200">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1">
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 transition-all hover:bg-white/10 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-400 transition-all hover:bg-red-500 hover:text-white"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="relative bg-black flex-1">
          <video
            ref={videoRef}
            src={`/${link}`}
            controls
            autoPlay
            className="w-full h-full"
            style={isFullscreen ? {} : { aspectRatio: `${width}/${height}` }}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
