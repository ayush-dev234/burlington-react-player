// ============================================
// BookViewer — Main page display area
// ============================================

import { useCallback, useRef, useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookStore } from "@/store/useBookStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { usePageFlipSound } from "@/hooks/usePageFlipSound";
import { getPageImagePath } from "@/utils/pageCalculations";
import { PAGE_ASPECT_RATIO } from "@/utils/constants";

export default function BookViewer() {
  const {
    currentPage,
    totalPages,
    viewMode,
    zoomLevel,
    nextPage,
    prevPage,
    setPage,
  } = useBookStore();

  const { playFlip } = usePageFlipSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState(0);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Measure container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerSize({
          w: entry.contentRect.width,
          h: entry.contentRect.height,
        });
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Calculate page dimensions
  const pageDimensions = useMemo(() => {
    const { w, h } = containerSize;
    if (w === 0 || h === 0) return { pageWidth: 0, pageHeight: 0 };

    const isDouble = viewMode === "double" && currentPage > 1;
    // Account for nav button width (48px each) + small gap
    const navButtonSpace = 100;
    const availableWidth = w - navButtonSpace;
    const availableHeight = h - 8; // minimal vertical padding

    const pageAspect = PAGE_ASPECT_RATIO;
    const numPages = isDouble ? 2 : 1;

    let pageWidth = availableWidth / numPages;
    let pageHeight = pageWidth / pageAspect;

    if (pageHeight > availableHeight) {
      pageHeight = availableHeight;
      pageWidth = pageHeight * pageAspect;
    }

    return {
      pageWidth: Math.floor(pageWidth),
      pageHeight: Math.floor(pageHeight),
    };
  }, [containerSize, viewMode, currentPage]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    prevPage();
    playFlip();
  }, [prevPage, playFlip]);

  const handleNext = useCallback(() => {
    setDirection(1);
    nextPage();
    playFlip();
  }, [nextPage, playFlip]);

  // Keyboard + swipe
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);

  // Double-page spread
  const isDouble = viewMode === "double" && currentPage > 1;
  const leftPage = currentPage;
  const rightPage =
    isDouble && currentPage + 1 <= totalPages ? currentPage + 1 : null;

  // Touch swipe
  const touchRef = useRef({ startX: 0, startY: 0 });

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    touchRef.current.startX = touch.clientX;
    touchRef.current.startY = touch.clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touch = e.changedTouches[0];
    if (!touch) return;
    const dx = touch.clientX - touchRef.current.startX;
    const dy = touch.clientY - touchRef.current.startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      if (dx > 0) handlePrev();
      else handleNext();
    }
  };

  return (
    <div
      ref={containerRef}
      id="book-viewport"
      className="relative flex flex-1 items-center justify-center overflow-hidden select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Previous Button */}
      <NavButton
        direction="prev"
        onClick={handlePrev}
        disabled={currentPage <= 1}
      />

      {/* Book Container */}
      <div
        id="book-container"
        className="relative flex items-center justify-center"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.2s ease-out",
        }}
      >
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "tween",
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex gap-0.5"
          >
            {/* Left / Single Page */}
            <PageImage
              pageNum={leftPage}
              width={pageDimensions.pageWidth}
              height={pageDimensions.pageHeight}
              onDoubleClick={() => {
                // Navigate on double-click at edges
              }}
              totalPages={totalPages}
            />

            {/* Right Page (double mode) */}
            {rightPage && (
              <PageImage
                pageNum={rightPage}
                width={pageDimensions.pageWidth}
                height={pageDimensions.pageHeight}
                totalPages={totalPages}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next Button */}
      <NavButton
        direction="next"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      />

      {/* Bookmark indicator */}
      <BookmarkCorner page={currentPage} setPage={setPage} />
    </div>
  );
}

// ── Page animation variants ──────────────────────────────────────────

const pageVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

// ── Page Image ───────────────────────────────────────────────────────

function PageImage({
  pageNum,
  width,
  height,
  onDoubleClick,
  totalPages: _totalPages,
}: {
  pageNum: number;
  width: number;
  height: number;
  onDoubleClick?: () => void;
  totalPages: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const src = getPageImagePath(pageNum);

  return (
    <div
      className="relative overflow-hidden rounded-sm bg-white shadow-lg"
      style={{ width, height }}
      onDoubleClick={onDoubleClick}
    >
      {/* Skeleton loader */}
      {!loaded && !error && (
        <div className="absolute inset-0 animate-pulse bg-gray-200" />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-400">
          <div className="text-3xl mb-2">📄</div>
          <span className="text-sm">Page {pageNum}</span>
        </div>
      )}

      {/* Actual image */}
      <img
        src={src}
        alt={`Page ${pageNum}`}
        className={`h-full w-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        draggable={false}
      />

      {/* Page number overlay */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-0.5 text-xs text-white backdrop-blur-sm">
        {pageNum}
      </div>
    </div>
  );
}

// ── Navigation Buttons ───────────────────────────────────────────────

function NavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  const id = direction === "prev" ? "ebook-prev" : "ebook-next";

  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`group z-10 mx-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-on-surface-muted shadow-md transition-all hover:bg-brand-500 hover:text-white hover:shadow-lg active:scale-90 disabled:opacity-30 disabled:pointer-events-none ${
        direction === "prev" ? "" : ""
      }`}
      title={direction === "prev" ? "Previous" : "Next"}
    >
      <Icon size={22} />
    </button>
  );
}

// ── Bookmark Corner ──────────────────────────────────────────────────

function BookmarkCorner({
  page,
}: {
  page: number;
  setPage: (p: number) => void;
}) {
  const isBooked = useBookmarkStore((s) => s.isBookmarked(page));
  const toggle = useBookmarkStore((s) => s.toggleBookmark);

  return (
    <button
      id="takeBookmark"
      onClick={() => toggle(page)}
      className={`absolute top-0 right-8 z-30 transition-all duration-200 ${
        isBooked
          ? "text-yellow-500 drop-shadow-md"
          : "text-on-surface-subtle hover:text-yellow-400"
      }`}
      title="Click to toggle bookmark"
    >
      <svg width={28} height={36} viewBox="0 0 28 36" fill="currentColor">
        <path d="M0 0h28v36l-14-8-14 8V0z" />
      </svg>
    </button>
  );
}
