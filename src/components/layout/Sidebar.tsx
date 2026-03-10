// ============================================
// Sidebar — Table of Contents
// ============================================

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getTocData } from "@/config/toc.config";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Sidebar() {
  const isOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const currentPage = useBookStore((s) => s.currentPage);
  const setPage = useBookStore((s) => s.setPage);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setSidebarOpen(false), isOpen);

  let tocEntries: ReturnType<typeof getTocData> = [];
  try {
    tocEntries = getTocData();
  } catch {
    tocEntries = [];
  }

  const handleNavigation = (page: number) => {
    console.log("page number:", page);
    setPage(page);
    setSidebarOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-black/40 no-print"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <motion.nav
            ref={ref}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-70 flex w-80 max-w-[85vw] flex-col bg-surface shadow-2xl pr-3 no-print"
            role="navigation"
            aria-label="Table of Contents"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-on-surface">
                Table of Contents
              </h2>

              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-2 text-on-surface-muted transition-colors hover:bg-surface-bright hover:text-on-surface"
                aria-label="Close sidebar"
              >
                <X size={22} />
              </button>
            </div>

            {/* TOC List */}
            <div className="flex-1 overflow-y-auto py-4 px-2">
              {tocEntries.length === 0 ? (
                <div className="px-6 py-10 text-center text-sm text-on-surface-muted">
                  No table of contents available.
                </div>
              ) : (
                <ul className="space-y-1 px-1">
                  {tocEntries.map((entry, index) => {
                    const isActive = currentPage === entry.page;
                    const isUnit = entry.isUnitHeader;

                    return (
                      <li key={`${entry.page}-${index}`}>
                        <button
                          onClick={() => handleNavigation(entry.page)}
                          className={`group flex w-full items-start justify-between gap-3 py-3 pr-8 text-left rounded-r-lg transition-all duration-200
                            
                            ${
                              isUnit
                                ? "pl-6 bg-brand-50 font-semibold text-brand-700 border-l-4 border-brand-500 text-[15px]"
                                : "pl-10 text-sm text-on-surface hover:bg-surface-bright"
                            }

                            ${
                              isActive && !isUnit
                                ? "bg-brand-50/60 text-brand-700 font-medium border-l-4 border-brand-400"
                                : ""
                            }
                          `}
                        >
                          {/* Title */}
                          <span className="flex-1 leading-snug">
                            {entry.title}
                          </span>

                          {/* Page Number */}
                          <span
                            className={`shrink-0 pt-0.5 text-xs tabular-nums transition-colors
                              ${
                                isActive
                                  ? "text-brand-600 font-semibold"
                                  : "text-on-surface-muted group-hover:text-on-surface"
                              }
                            `}
                          >
                            {entry.page}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}