import React, {
  useCallback,
  useRef,
  useEffect,
  useState,
  useMemo,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useBookStore } from "@/store/useBookStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { usePageFlipSound } from "@/hooks/usePageFlipSound";
import { getPageImagePath } from "@/utils/pageCalculations";
import { PAGE_ASPECT_RATIO } from "@/utils/constants";
import type { InteractiveItem } from "@/types/book.types";
import PageOverlay from "@/components/interactive/PageOverlay";
import ActivityModal from "@/components/interactive/ActivityModal";
import VideoModal from "@/components/interactive/VideoModal";
import AudioPlayer from "@/components/interactive/AudioPlayer";
import ThumbnailStrip from "@/components/reader/ThumbnailStrip";
import PagePreviewModal from "@/components/reader/PagePreviewModal";
import DrawingCanvas from "@/components/annotations/DrawingCanvas";
import DrawingToolbar from "@/components/annotations/DrawingToolbar";
import { useDrawingStore } from "@/store/useDrawingStore";
import { motion, AnimatePresence } from "framer-motion";
// @ts-ignore
import HTMLFlipBook from "react-pageflip";

const FlipBook = HTMLFlipBook as any;

/**
 * Determine if the current page is a "single" page in double mode with showCover.
 * With showCover={true}, react-pageflip renders:
 * - Page 1 (cover): single page on the RIGHT half of the spread area
 * - Last page (if even count): single page on the LEFT half
 * - All other pages: full two-page spread
 */
function isCoverOrBack(
  page: number,
  totalPages: number,
): "cover" | "back" | false {
  if (page <= 1) return "cover";
  if (page >= totalPages && totalPages % 2 === 0) return "back";
  return false;
}

// ── Modal state type ─────────────────────────────────────────────────
interface ModalState {
  type: "activity" | "video" | "audio" | null;
  item: InteractiveItem | null;
}

export default function BookViewer() {
  const { currentPage, totalPages, viewMode, zoomLevel, setPage, nextPage, prevPage } =
    useBookStore();

  const { playFlip } = usePageFlipSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

  // Track whether the flipbook component is ready to accept programmatic page changes
  const flipbookReadyRef = useRef(false);
  // Flag to suppress store→flipbook sync when the change originated from a flip event
  const suppressSyncRef = useRef(false);

  // Direction tracking for single-mode animations
  const prevPageRef = useRef(currentPage);
  const [slideDirection, setSlideDirection] = useState(1);

  useEffect(() => {
    if (currentPage > prevPageRef.current) {
      setSlideDirection(1);
    } else if (currentPage < prevPageRef.current) {
      setSlideDirection(-1);
    }
    prevPageRef.current = currentPage;
  }, [currentPage]);

  // ── Interactive modal state ────────────────────────────────────────
  const [modal, setModal] = useState<ModalState>({ type: null, item: null });

  // ── Page preview modal state ──────────────────────────────────────
  const [previewPage, setPreviewPage] = useState<number | null>(null);

  const handleItemClick = useCallback((item: InteractiveItem) => {
    if (item.type === "video") {
      setModal({ type: "video", item });
    } else if (item.type === "audio") {
      setModal({ type: "audio", item });
    } else {
      // iframe activities
      setModal({ type: "activity", item });
    }
  }, []);

  const closeModal = useCallback(() => {
    setModal({ type: null, item: null });
  }, []);

  const drawingTool = useDrawingStore((s) => s.activeTool);

  const handlePageClick = useCallback((pageNum: number) => {
    // Don't open preview modal when drawing tool is active
    if (drawingTool !== "none") return;
    setPreviewPage(pageNum);
  }, [drawingTool]);

  // ── Force remount key ──────────────────────────────────────────────
  // react-pageflip does NOT support dynamically changing usePortrait or
  // width/height after mount. We use a key that includes viewMode + dimensions
  // to force a full unmount/remount whenever these change.
  // We also capture the currentPage at remount time so the book opens to the
  // correct page via startPage.
  const [remountKey, setRemountKey] = useState(0);
  const startPageRef = useRef(0); // 0-indexed start page for react-pageflip

  // When viewMode changes, trigger a remount and preserve the current page
  useEffect(() => {
    // Reset flipbook ready state since we're about to remount
    flipbookReadyRef.current = false;
    suppressSyncRef.current = false;
    // Store the current page so the new FlipBook instance opens at the right spot
    startPageRef.current = currentPage - 1;
    setRemountKey((k) => k + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  // ── Measure container ──────────────────────────────────────────────
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

  // ── Calculate page dimensions ──────────────────────────────────────
  const pageDimensions = useMemo(() => {
    const { w, h } = containerSize;
    if (w === 0 || h === 0) return { pageWidth: 0, pageHeight: 0 };

    const isDouble = viewMode === "double";
    const navButtonSpace = 48;
    const availableWidth = w - navButtonSpace;
    const availableHeight = h;

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
  }, [containerSize, viewMode]);

  const handlePrev = useCallback(() => {
    prevPage();
  }, [prevPage]);

  const handleNext = useCallback(() => {
    nextPage();
  }, [nextPage]);

  // ── Sync store → flipbook (for toolbar "go to page", sidebar TOC clicks, etc.) ──
  useEffect(() => {
    // Only applies to double mode. Single mode is natively driven by React state now.
    if (viewMode !== "double") return;

    // If this change came from a flipbook event, skip the sync
    if (suppressSyncRef.current) {
      suppressSyncRef.current = false;
      return;
    }
    
    // Use a small timeout to ensure flipbook is completely mounted
    const timer = setTimeout(() => {
      const pf = bookRef.current?.pageFlip();
      if (!pf) return;

      try {
        const targetIndex = currentPage - 1;
        const currentIndex = pf.getCurrentPageIndex();
        
        if (typeof currentIndex === 'number' && currentIndex !== targetIndex) {
          // Use the built-in flip() method for animated 2-page folds
          if (typeof pf.flip === 'function') {
            pf.flip(targetIndex);
          } else {
            pf.turnToPage(targetIndex);
          }
        }
      } catch (err) {
        console.warn("Flipbook not ready", err);
      }
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentPage, viewMode]);

  // ── Handle flipbook page changes (internal flips by user) ─────────
  const onPage = useCallback(
    (e: any) => {
      // e.data is 0-indexed page number from react-pageflip
      const newPage = e.data + 1;

      // Mark flipbook as ready after first event
      if (!flipbookReadyRef.current) {
        flipbookReadyRef.current = true;
      }

      if (newPage !== currentPage) {
        // Suppress the sync effect so it doesn't echo back to the flipbook
        suppressSyncRef.current = true;
        setPage(newPage);
      }
    },
    [currentPage, setPage],
  );

  const onFlipEvent = useCallback(() => {
    playFlip();
  }, [playFlip]);

  // ── Keyboard navigation ────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);

  // ── Determine translateX offset for centering cover/back ───────────
  const translateOffset = useMemo(() => {
    if (viewMode !== "double") return "0%";

    const singleStatus = isCoverOrBack(currentPage, totalPages);
    if (singleStatus === "cover") return "-25%";
    if (singleStatus === "back") return "25%";
    return "0%";
  }, [viewMode, currentPage, totalPages]);

  return (
    <div
      ref={containerRef}
      id="book-viewport"
      className="relative flex flex-1 items-center justify-center overflow-hidden select-none"
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
        className="relative flex items-center justify-center drop-shadow-2xl"
        style={{
          transform: `scale(${zoomLevel}) translateX(${translateOffset})`,
          transformOrigin: "center center",
          transition: "transform 0.4s ease-out",
          width:
            viewMode === "double"
              ? pageDimensions.pageWidth * 2
              : pageDimensions.pageWidth,
          height: pageDimensions.pageHeight,
        }}
      >
          {/* Render Full Flipbook for Double Mode */}
          {viewMode === "double" && pageDimensions.pageWidth > 0 && pageDimensions.pageHeight > 0 && (
            <FlipBook
              key={`flipbook-double-${remountKey}`}
              width={pageDimensions.pageWidth}
              height={pageDimensions.pageHeight}
              size="fixed"
              minWidth={300}
              maxWidth={1000}
              minHeight={400}
              maxHeight={1500}
              maxShadowOpacity={0.5}
              showCover={true}
              startPage={startPageRef.current}
              usePortrait={false}
              ref={bookRef}
              onFlip={onPage}
              onChangeState={onFlipEvent}
              className="flip-book"
              flippingTime={1000}
              disableFlipByClick={true}
              clickEventForward={true}
              showPageCorners={false}
              useMouseEvents={false}
            >
              {Array.from({ length: totalPages }).map((_, i) => (
                <PageImage
                  key={i}
                  pageNum={i + 1}
                  onItemClick={handleItemClick}
                  onPageClick={handlePageClick}
                />
              ))}
            </FlipBook>
          )}

          {/* Render Smooth Framer Motion Slider for Single Mode */}
          {viewMode === "single" && pageDimensions.pageWidth > 0 && pageDimensions.pageHeight > 0 && (
            <div 
              className="relative w-full h-full overflow-hidden bg-white/50 shadow-inner rounded-sm"
            >
              <AnimatePresence initial={false} custom={slideDirection} mode="wait">
                <motion.div
                  key={currentPage}
                  custom={slideDirection}
                  variants={{
                    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0 })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute inset-0"
                  onAnimationStart={onFlipEvent}
                >
                  <PageImage
                    pageNum={currentPage}
                    onItemClick={handleItemClick}
                    onPageClick={handlePageClick}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}

        {/* Drawing canvas overlay — sits on top of the book, outside react-pageflip */}
        <DrawingCanvas />
      </div>

      {/* Next Button */}
      <NavButton
        direction="next"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      />

      <BookmarkCorner page={currentPage} setPage={setPage} />

      {/* ── Thumbnail Strip ────────────────────────────────────────── */}
      <ThumbnailStrip />

      {/* ── Drawing Toolbar Panel ──────────────────────────────────── */}
      <DrawingToolbar />

      {/* ── Interactive Modals ──────────────────────────────────────── */}
      <ActivityModal
        isOpen={modal.type === "activity" && !!modal.item}
        onClose={closeModal}
        link={modal.item?.link ?? ""}
        title={modal.item?.title ?? "Activity"}
        size={modal.item?.size ?? "1024x720"}
      />

      <VideoModal
        isOpen={modal.type === "video" && !!modal.item}
        onClose={closeModal}
        link={modal.item?.link ?? ""}
        title={modal.item?.title ?? "Video"}
        size={modal.item?.size ?? "1024x720"}
      />

      <AudioPlayer
        isOpen={modal.type === "audio" && !!modal.item}
        onClose={closeModal}
        link={modal.item?.link ?? ""}
        title={modal.item?.title ?? "Audio"}
      />

      {/* ── Page Preview Modal ─────────────────────────────────────── */}
      <PagePreviewModal
        isOpen={previewPage !== null}
        onClose={() => setPreviewPage(null)}
        pageNum={previewPage ?? 1}
      />
    </div>
  );
}

// ── Page Image ───────────────────────────────────────────────────────

interface PageImageProps {
  pageNum: number;
  onItemClick: (item: InteractiveItem) => void;
  onPageClick?: (pageNum: number) => void;
}

const PageImage = React.forwardRef<HTMLDivElement, PageImageProps>(
  ({ pageNum, onItemClick, onPageClick }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const src = getPageImagePath(pageNum);

    return (
      <div
        ref={ref}
        className="page bg-white relative overflow-hidden flex items-center justify-center border-x border-gray-100 cursor-pointer"
        onClick={() => onPageClick?.(pageNum)}
      >
        {!loaded && !error && (
          <div className="absolute inset-0 animate-pulse bg-gray-100" />
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <div className="text-3xl mb-2">📄</div>
            <span className="text-sm">Page {pageNum}</span>
          </div>
        )}

        <img
          src={src}
          alt={`Page ${pageNum}`}
          className={`h-full w-full object-contain pointer-events-none transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          draggable={false}
        />

        {/* Interactive overlay with activity/video icons */}
        <PageOverlay pageNum={pageNum} onItemClick={onItemClick} />

        {/* Page number overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-0.5 text-xs text-white backdrop-blur-sm shadow-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {pageNum}
        </div>
      </div>
    );
  },
);
PageImage.displayName = "PageImage";

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
      className={`group z-50 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-brand-600 hover:shadow-lg active:scale-90 disabled:opacity-30 disabled:pointer-events-none ${
        direction === "prev" ? "ml-2 mr-3" : "ml-3 mr-2"
      }`}
      title={direction === "prev" ? "Previous" : "Next"}
    >
      <Icon size={26} strokeWidth={2.5} />
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
      className={`absolute top-4 right-8 z-50 transition-all duration-200 ${
        isBooked
          ? "text-yellow-500 drop-shadow-md scale-110"
          : "text-gray-400 hover:text-yellow-400 hover:scale-110"
      }`}
      title="Toggle bookmark"
    >
      <svg width={24} height={32} viewBox="0 0 28 36" fill="currentColor">
        <path d="M0 0h28v36l-14-8-14 8V0z" />
      </svg>
    </button>
  );
}
