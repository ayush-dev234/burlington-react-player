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
// @ts-ignore
import HTMLFlipBook from "react-pageflip";

const FlipBook = HTMLFlipBook as any;

export default function BookViewer() {
  const { currentPage, totalPages, viewMode, zoomLevel, setPage } =
    useBookStore();

  const { playFlip } = usePageFlipSound();
  const containerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
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

    const isDouble = viewMode === "double";
    const navButtonSpace = 100;
    const availableWidth = w - navButtonSpace;
    const availableHeight = h - 16;

    // For react-pageflip, pageWidth refers to a single page's width
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
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().flipPrev();
    }
  }, []);

  const handleNext = useCallback(() => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      bookRef.current.pageFlip().flipNext();
    }
  }, []);

  // Sync external page changes (e.g. from toolbar) into the flipbook
  useEffect(() => {
    if (bookRef.current && bookRef.current.pageFlip()) {
      const pageFlip = bookRef.current.pageFlip();
      const currentFlipPage = pageFlip.getCurrentPageIndex() + 1;

      // if external currentPage differs from flipbook current page, turn to it
      if (currentFlipPage !== currentPage) {
        // react-pageflip pages are 0-indexed
        pageFlip.turnToPage(currentPage - 1);
      }
    }
  }, [currentPage]);

  // Handle internal flipbook page changes
  const onPage = useCallback(
    (e: any) => {
      // e.data is the new 0-indexed page
      const newPage = e.data + 1;
      if (newPage !== currentPage) {
        setPage(newPage);
      }
    },
    [currentPage, setPage],
  );

  const onFlipEvent = useCallback(() => {
    playFlip();
  }, [playFlip]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handlePrev, handleNext]);

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
          transform: `scale(${zoomLevel}) translateX(${
            viewMode === "double"
              ? currentPage === 1
                ? "-25%"
                : currentPage === totalPages
                  ? totalPages % 2 === 0
                    ? "25%"
                    : "-25%"
                  : "0%"
              : "0%"
          })`,
          transformOrigin: "center center",
          transition: "transform 0.4s ease-out",
          width:
            viewMode === "double"
              ? pageDimensions.pageWidth * 2
              : pageDimensions.pageWidth,
          height: pageDimensions.pageHeight,
        }}
      >
        {pageDimensions.pageWidth > 0 && pageDimensions.pageHeight > 0 && (
          <FlipBook
            width={pageDimensions.pageWidth}
            height={pageDimensions.pageHeight}
            size="fixed"
            minWidth={300}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1500}
            maxShadowOpacity={0.5}
            showCover={true}
            usePortrait={viewMode === "single"}
            ref={bookRef}
            onFlip={onPage}
            onChangeState={onFlipEvent}
            className="flip-book"
            flippingTime={1000}
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <PageImage key={i} pageNum={i + 1} />
            ))}
          </FlipBook>
        )}
      </div>

      {/* Next Button */}
      <NavButton
        direction="next"
        onClick={handleNext}
        disabled={currentPage >= totalPages}
      />

      <BookmarkCorner page={currentPage} setPage={setPage} />
    </div>
  );
}

// ── Page Image ───────────────────────────────────────────────────────

const PageImage = React.forwardRef<HTMLDivElement, { pageNum: number }>(
  ({ pageNum }, ref) => {
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);
    const src = getPageImagePath(pageNum);

    return (
      <div
        ref={ref}
        className="page bg-white relative overflow-hidden flex items-center justify-center pointer-events-none border-x border-gray-100"
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

        {/* Page overlay */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-0.5 text-xs text-white backdrop-blur-sm shadow-sm opacity-0 hover:opacity-100 transition-opacity">
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
      className={`group z-50 mx-2 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-md backdrop-blur-md transition-all hover:bg-white hover:text-brand-600 hover:shadow-lg active:scale-90 disabled:opacity-30 disabled:pointer-events-none ${
        direction === "prev" ? "mr-4" : "ml-4"
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
      <svg width={32} height={42} viewBox="0 0 28 36" fill="currentColor">
        <path d="M0 0h28v36l-14-8-14 8V0z" />
      </svg>
    </button>
  );
}
