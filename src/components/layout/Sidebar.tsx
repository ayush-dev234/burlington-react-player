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
            className="fixed inset-0 z-[60] bg-black/40 no-print"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <motion.nav
            ref={ref}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-[70] flex w-80 max-w-[85vw] flex-col bg-surface shadow-2xl no-print"
            role="navigation"
            aria-label="Table of Contents"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-lg font-semibold text-on-surface">
                Table of Contents
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-on-surface-muted transition-colors hover:bg-surface-bright hover:text-on-surface"
                aria-label="Close sidebar"
              >
                <X size={20} />
              </button>
            </div>

            {/* TOC List */}
            <div className="flex-1 overflow-y-auto py-2">
              {tocEntries.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-on-surface-muted">
                  No table of contents available.
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {tocEntries.map((entry, index) => {
                    const isActive = currentPage === entry.page;
                    const isUnit = entry.isUnitHeader;

                    return (
                      <li key={`${entry.page}-${index}`}>
                        <button
                          onClick={() => handleNavigation(entry.page)}
                          className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors
                            ${
                              isUnit
                                ? "bg-brand-50 font-semibold text-brand-700 border-l-3 border-brand-500"
                                : "hover:bg-surface-bright"
                            }
                            ${
                              isActive && !isUnit
                                ? "bg-brand-50/50 text-brand-600 font-medium border-l-3 border-brand-400"
                                : ""
                            }
                            ${
                              !isUnit && !isActive ? "pl-7 text-on-surface" : ""
                            }
                          `}
                        >
                          <span className="flex-1 min-w-0 truncate">
                            {entry.title}
                          </span>
                          <span
                            className={`shrink-0 text-xs tabular-nums ${
                              isActive
                                ? "text-brand-500 font-bold"
                                : "text-on-surface-subtle"
                            }`}
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
