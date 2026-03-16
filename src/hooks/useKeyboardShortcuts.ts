// ============================================
// useKeyboardShortcuts Hook — Centralized keyboard handling
// ============================================

import { useHotkeys } from "react-hotkeys-hook";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { useFullscreen } from "./useFullscreen";

export function useKeyboardShortcuts() {
  const { nextPage, prevPage, setPage, zoomIn, zoomOut, resetZoom, totalPages } =
    useBookStore();
  const { setActiveModal } = useUIStore();
  const { toggleFullscreen } = useFullscreen();

  // Navigation
  useHotkeys("right, ArrowRight", () => nextPage(), { preventDefault: true });
  useHotkeys("left, ArrowLeft", () => prevPage(), { preventDefault: true });
  useHotkeys("home", () => setPage(1), { preventDefault: true });
  useHotkeys("end", () => setPage(totalPages), { preventDefault: true });

  // Zoom
  useHotkeys("equal, plus", () => zoomIn(), { preventDefault: true });
  useHotkeys("minus", () => zoomOut(), { preventDefault: true });
  useHotkeys("0", () => resetZoom(), { preventDefault: true });

  // Fullscreen
  useHotkeys("f", () => toggleFullscreen(), { preventDefault: true });

  // Close modals
  useHotkeys("escape", () => setActiveModal(null));

  // Shortcuts help
  useHotkeys("shift+/", () => setActiveModal("shortcuts"), {
    preventDefault: true,
  });
}
