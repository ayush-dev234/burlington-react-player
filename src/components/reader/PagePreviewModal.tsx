// ============================================
// PagePreviewModal — Light-themed page preview popup
// ============================================
// Opens a full-size page preview in a light modal.
// White background with brand-colored header bar.
// Scrollable content for zoomed-in viewing.
// Close on X button, backdrop click, or Escape key.
// ============================================

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getPageImagePath } from "@/utils/pageCalculations";

interface PagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageNum: number;
}

export default function PagePreviewModal({
  isOpen,
  onClose,
  pageNum,
}: PagePreviewModalProps) {
  const src = getPageImagePath(pageNum);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
          onClick={onClose}
        >
          {/* Modal card */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative flex flex-col rounded-none sm:rounded-xl overflow-hidden shadow-2xl w-full sm:w-auto"
            style={{
              width: "min(96vw, 820px)",
              maxHeight: "93vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar (brand color) */}
            <div className="flex items-center justify-between bg-[#0abab5] px-3 sm:px-4 py-2 shrink-0">
              <span className="text-white font-semibold text-xs sm:text-sm">
                Page {pageNum}
              </span>

              {/* Close button */}
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white transition-all hover:bg-white/40 hover:scale-110 active:scale-95"
                title="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* Scrollable page content */}
            <div
              className="flex-1 overflow-y-auto bg-white"
              style={{ maxHeight: "calc(90vh - 48px)" }}
            >
              <img
                src={src}
                alt={`Page ${pageNum} - Preview`}
                className="w-full h-auto object-contain select-none"
                draggable={false}
              />
            </div>

            {/* Bottom border accent */}
            <div className="h-1 bg-[#2988d1] shrink-0" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
