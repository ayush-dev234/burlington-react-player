// ============================================
// ThumbnailStrip — Bottom carousel of page thumbnails
// ============================================
// Uses Embla Carousel for smooth horizontal scrolling.
// Click a thumbnail to jump to that page.
// Current page(s) highlighted with a ring.
// Toggle visibility from Toolbar.
// ============================================

import { useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { getPageImagePath } from "@/utils/pageCalculations";

export default function ThumbnailStrip() {
  const { currentPage, totalPages, viewMode, setPage } = useBookStore();
  const { isThumbnailStripVisible, toggleThumbnailStrip } = useUIStore();

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  // Scroll to the active thumbnail whenever currentPage changes
  useEffect(() => {
    if (!emblaApi || !isThumbnailStripVisible) return;
    // Scroll to the current page index (0-based)
    const index = currentPage - 1
    emblaApi.scrollTo(index, false);
  }, [currentPage, emblaApi, isThumbnailStripVisible]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  // Determine which pages are "active" (visible in double mode)
  const isActive = useCallback(
    (pageNum: number) => {
      if (viewMode === "single") return pageNum === currentPage;
      // In double mode, the spread shows currentPage and currentPage+1
      return pageNum === currentPage || pageNum === currentPage + 1;
    },
    [currentPage, viewMode],
  );

  // Navigate to the clicked page
  const handleThumbnailClick = useCallback(
    (pageNum: number) => {
    if (viewMode === "double") {
      const spreadStart = Math.max(1, pageNum % 2 === 0 ? pageNum : pageNum - 1);
      setPage(spreadStart);
    } else {
      setPage(pageNum);
    }
  },
  [setPage, viewMode],
  );

  return (
    <AnimatePresence>
      {isThumbnailStripVisible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", damping: 28, stiffness: 300 }}
          className="fixed bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 w-[95vw] sm:w-[90vw] max-w-4xl"
        >
          <div className="relative flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-white/95 px-2 sm:px-3 py-2 sm:py-3 shadow-2xl border border-gray-200/60 backdrop-blur-xl">
            {/* Close button */}
            <button
              onClick={toggleThumbnailStrip}
              className="absolute -top-3 -right-3 z-50 flex h-7 w-7 items-center justify-center rounded-full bg-gray-800 text-white shadow-lg transition-all hover:bg-red-500 hover:scale-110 active:scale-95"
              title="Close thumbnails"
            >
              <X size={14} />
            </button>

            {/* Prev arrow */}
            <button
              onClick={scrollPrev}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all hover:bg-brand-100 hover:text-brand-600 active:scale-90"
              title="Scroll left"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Carousel */}
            <div ref={emblaRef} className="flex-1 overflow-hidden">
              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const active = isActive(pageNum);

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleThumbnailClick(pageNum)}
                      className={`group relative shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                        active
                          ? "ring-4 ring-brand-500 ring-offset-2 shadow-xl scale-110 z-10"
                          : "ring-1 ring-gray-200 hover:ring-brand-300 hover:shadow-md hover:scale-[1.05]"
                      }`}
                      title={`Go to page ${pageNum}`}
                    >
                      <ThumbnailImage pageNum={pageNum} />

                      {/* Page number badge */}
                      <span
                        className={`absolute bottom-0 inset-x-0 py-0.5 text-center text-[10px] font-semibold transition-colors ${
                          active
                            ? "bg-brand-500 text-white"
                            : "bg-black/50 text-white/90 group-hover:bg-brand-500/80"
                        }`}
                      >
                        {pageNum}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next arrow */}
            <button
              onClick={scrollNext}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 transition-all hover:bg-brand-100 hover:text-brand-600 active:scale-90"
              title="Scroll right"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── Thumbnail Image (lazy loaded) ────────────────────────────────────

function ThumbnailImage({ pageNum }: { pageNum: number }) {
  const imgRef = useRef<HTMLImageElement>(null);
  const src = getPageImagePath(pageNum);

  return (
    <div className="w-16 h-20 sm:w-[72px] sm:h-[92px] bg-gray-100 flex items-center justify-center">
      <img
        ref={imgRef}
        src={src}
        alt={`Page ${pageNum}`}
        loading="lazy"
        className="w-full h-full object-cover transition-opacity duration-200"
        draggable={false}
        onError={(e) => {
          // Show fallback on error
          (e.target as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
