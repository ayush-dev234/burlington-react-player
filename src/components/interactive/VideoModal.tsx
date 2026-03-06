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
  const [videoError, setVideoError] = useState(false);

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
      setVideoError(false);
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
    if (!isOpen) {
      setIsFullscreen(false);
      setVideoError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Half-screen dimensions by default: 50% of viewport width, maintaining aspect ratio
  const aspect = width / height;
  const halfW = Math.min(window.innerWidth * 0.5, 720);
  const halfH = halfW / aspect;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col shadow-2xl overflow-hidden transition-all duration-300"
        style={
          isFullscreen
            ? {
                width: "100vw",
                height: "100vh",
                borderRadius: 0,
                background: "#111",
              }
            : {
                width: halfW,
                height: halfH + 40, // +40 for header
                maxWidth: "90vw",
                maxHeight: "85vh",
                borderRadius: 10,
                background: "#111",
              }
        }
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — dark gradient bar */}
        <div
          className="flex items-center justify-between px-3 py-1.5 text-white shrink-0"
          style={{ background: "linear-gradient(to right, #1a1a2e, #16213e)" }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <img
              src="/img/icons/video.svg"
              alt=""
              className="w-5 h-5 shrink-0 brightness-0 invert"
              draggable={false}
            />
            <h3 className="text-sm font-semibold truncate text-gray-100">
              {title}
            </h3>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {/* Fullscreen toggle */}
            <button
              onClick={() => setIsFullscreen((f) => !f)}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-300 transition-all hover:bg-white/15 hover:text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded text-gray-300 transition-all hover:bg-red-500/90 hover:text-white"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Video */}
        <div className="relative flex-1 bg-black flex items-center justify-center">
          {videoError ? (
            <div className="flex flex-col items-center justify-center gap-3 text-gray-400 p-8">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </svg>
              <p className="text-sm text-center">
                Video file not found.
                <br />
                <span className="text-xs text-gray-500">{link}</span>
              </p>
            </div>
          ) : (
            <video
              ref={videoRef}
              src={`/${link}`}
              controls
              autoPlay
              className="w-full h-full object-contain"
              style={isFullscreen ? {} : { aspectRatio: `${width}/${height}` }}
              onError={() => setVideoError(true)}
            >
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
