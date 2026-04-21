// ============================================
// AudioPlayer — Inline audio player for page audio items
// ============================================
// Compact play/pause button with a progress bar.
// Auto-stops when navigating away from the page.
// Uses native HTML5 <audio> element.
// ============================================

import { useState, useRef, useEffect, useCallback } from "react";
import { X, Play, Pause, Volume2 } from "lucide-react";

interface AudioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
  title: string;
  rect?: DOMRect;
}

export default function AudioPlayer({
  isOpen,
  onClose,
  link,
  title,
  rect,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);

  // Auto-play when opened
  useEffect(() => {
    if (isOpen && audioRef.current && !audioError) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isOpen, audioError]);

  // Stop audio when closed / navigating away
  useEffect(() => {
    if (!isOpen && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      setCurrentTime(0);
    }
  }, [isOpen]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [isPlaying]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }, []);

  const handleLoadedMetadata = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration],
  );

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!isOpen) return null;
    // Default to standard bottom-center
  let placementClass = "fixed bottom-20 left-1/2 -translate-x-1/2";
  let popupStyle: React.CSSProperties = {};

  if (rect) {
    placementClass = "fixed";
    // Sit 10px below the icon
    popupStyle.top = rect.bottom + 10;
    // Align with the left of the icon, but don't let it overflow off the right side of the screen!
    popupStyle.left = Math.min(rect.left, window.innerWidth - 350); 
  }

  return (
    <div
      className= {`${placementClass} z-9998 animate-fade-in`}
      style={popupStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-2xl border border-gray-200/60 backdrop-blur-md min-w-[320px] max-w-[420px]">
        {/* Audio icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-brand-500 to-brand-600 text-white shadow-md">
          <Volume2 size={18} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p className="text-sm font-semibold text-gray-800 truncate mb-1.5">
            {title}
          </p>

          {audioError ? (
            <p className="text-xs text-red-500">Audio file not found</p>
          ) : (
            <>
              {/* Progress bar */}
              <div
                className="group relative h-1.5 w-full cursor-pointer rounded-full bg-gray-200 transition-all hover:h-2"
                onClick={handleSeek}
              >
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-brand-400 to-brand-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
                {/* Thumb */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 h-3, w-3 rounded-full bg-brand-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ left: `calc(${progress}% - 6px)` }}
                />
              </div>

              {/* Time */}
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <span className="text-[10px] text-gray-400 tabular-nums">
                  {duration > 0 ? formatTime(duration) : "--:--"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Play/Pause button */}
        {!audioError && (
          <button
            onClick={togglePlay}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all active:scale-90 ${
              isPlaying
                ? "bg-brand-100 text-brand-600 hover:bg-brand-200"
                : "bg-gray-100 text-gray-700 hover:bg-brand-100 hover:text-brand-600"
            }`}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}

        {/* Close button */}
        <button
          onClick={onClose}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-400 transition-all hover:bg-red-100 hover:text-red-500 active:scale-90"
          title="Close"
        >
          <X size={14} />
        </button>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={`/${link}`}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onError={() => setAudioError(true)}
          preload="metadata"
        />
      </div>
    </div>
  );
}
