// ============================================
// usePageFlipSound Hook — Sound effect on page turn
// ============================================

import { useRef, useCallback } from "react";
import { useSettingsStore } from "@/store/useSettingsStore";

export function usePageFlipSound() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const playFlip = useCallback(() => {
    const soundEnabled = useSettingsStore.getState().soundEnabled;
    if (!soundEnabled) return;

    if (!audioRef.current) {
      audioRef.current = new Audio("/audio/pageflip.mp3");
    }
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Autoplay may be blocked before user interaction
    });
  }, []);

  return { playFlip };
}
