// ============================================
// Sidebar — Table of Contents
// ============================================

import { useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getTocData } from "@/config/toc.config";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import pagesData from "@/data/pages.json";

export default function Sidebar() {
  const isOpen = useUIStore((s) => s.isSidebarOpen);
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen);
  const currentPage = useBookStore((s) => s.currentPage);
  const setPage = useBookStore((s) => s.setPage);
  const [showToc, setShowToc] = useState(false);
  const [showVideoToc, setVideoToc] = useState(false);
  const [showInteractivesToc, setInteractivesToc] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setSidebarOpen(false), isOpen);

  let tocEntries: ReturnType<typeof getTocData> = { toc: [], mediaToc: [], interactiveToc: [] };
  try {
    tocEntries = getTocData();
  } catch {
    tocEntries = { toc: [], mediaToc: [], interactiveToc: [] };
  }

  const handleNavigation = (page: number) => {
    console.log("page number:", page);
    setPage(page);
    setSidebarOpen(false);
  };

  const animationPages = useMemo(() => {
    const anims: { page: number; title: string; isUnitHeader?: boolean }[] = [];
    Object.entries(pagesData).forEach(([pageStr, items]) => {
      if (Array.isArray(items)) {
        const hasAnimation = items.some(
          (item: any) => item.title === "Animation" || item.type === "video"
        );
        if (hasAnimation) {
          anims.push({ page: parseInt(pageStr, 10), title: "Animation" });
        }
      }
    });
    return anims.sort((a, b) => a.page - b.page);
  }, []);

  const interactivePages = useMemo(() => {
    const interactives: { page: number; title: string; isUnitHeader?: boolean }[] = [];
    Object.entries(pagesData).forEach(([pageStr, items]) => {
      if (Array.isArray(items)) {
        const hasInteractive = items.some(
          (item: any) => item.title === "Interactivity" || item.type === "iframe"
        );
        if (hasInteractive) {
          interactives.push({ page: parseInt(pageStr, 10), title: "Interactivity" });
        }
      }
    });
    return interactives.sort((a, b) => a.page - b.page);
  }, []);

  console.log(tocEntries);
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
            className="fixed inset-0 z-60 bg-black/40 backdrop-blur-[2px] no-print mt-45"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel — full-screen on mobile, w-80 on sm+ */}
          <motion.nav
            ref={ref}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-20 bottom-0 z-70 flex w-full sm:w-80 max-w-[100vw] sm:max-w-[85vw] flex-col bg-surface shadow-2xl no-print"
            role="navigation"
            aria-label="Table of Contents"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-semibold text-on-surface">
                Contents
              </h2>

              <button
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-center h-8 w-8 rounded-md text-on-surface-muted transition-colors"
                aria-label="Close sidebar"
              >
                <X className="ml-4" size={18} />
              </button>
            </div>
            <div className="border-b border-border">
              <button
                onClick={() => setShowToc(!showToc)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-bright transition-colors"
              >
                <span>Table of Contents</span>
                <span className="text-gray-400 text-xs">{showToc ? "▼" : "▶"}</span>
              </button>
            </div>
            {/* TOC List */}
            <AnimatePresence>
              {showToc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-auto"
                >
                  <ul className="space-y-1 px-1">
                    {tocEntries.toc?.map((entry: any, index: number) => {
                      const isActive = currentPage === entry.page;
                      const isUnit = entry.isUnitHeader;

                      return (
                        <li key={`${entry.page}-${index}`}>
                          <button
                            onClick={() => handleNavigation(entry.page)}
                            className={`flex w-full justify-between py-1.5 px-5 text-left rounded-md transition
                              
                              ${
                                isUnit
                                  ? "pl-6  text-brand-700 bg-brand-50"
                                  : "pl-10 text-sm hover:bg-surface-bright"
                              }

                              ${
                                isActive
                                  ? "bg-brand-100 font-medium text-brand-700"
                                  : ""
                              }
                            `}
                          >
                            <span className="text-xs">{entry.title}</span>
                            <span className="text-xs">{entry.page}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="border-b border-border">
              <button
                onClick={() => setVideoToc(!showVideoToc)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-bright transition-colors"
              >
                <span>Animations</span>
                <span className="text-gray-400 text-xs">{showVideoToc ? "▼" : "▶"}</span>
              </button>
            </div>
            <AnimatePresence>
              {showVideoToc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-auto"
                >
                  <ul className="space-y-1 px-1">
                    {animationPages.map((entry: any, index: number) => {
                      const isActive = currentPage === entry.page;
                      const isUnit = entry.isUnitHeader;

                      return (
                        <li key={`${entry.page}-${index}`}>
                          <button
                            onClick={() => handleNavigation(entry.page)}
                            className={`flex w-full justify-between py-1.5 px-5 text-left rounded-md transition
                              
                              ${
                                isUnit
                                  ? "pl-6 font-semibold text-brand-700 bg-brand-50"
                                  : "pl-10 text-sm hover:bg-surface-bright"
                              }

                              ${
                                isActive
                                  ? "bg-brand-100 font-medium text-brand-700"
                                  : ""
                              }
                            `}
                          >
                            <span className="text-xs">{entry.title}</span>
                            <span className="text-xs">{entry.page}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="border-b border-border">
              <button
                onClick={() => setInteractivesToc(!showInteractivesToc)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium text-on-surface hover:bg-surface-bright transition-colors"
              >
                <span>Interactivities</span>
                <span className="text-gray-400 text-xs">{showInteractivesToc ? "▼" : "▶"}</span>
              </button>
            </div>
            <AnimatePresence>
              {showInteractivesToc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-auto"
                >
                  <ul className="space-y-1 px-1">
                    {interactivePages.map(
                      (entry: any, index: number) => {
                        const isActive = currentPage === entry.page;
                        const isUnit = entry.isUnitHeader;

                        return (
                          <li key={`${entry.page}-${index}`}>
                            <button
                              onClick={() => handleNavigation(entry.page)}
                              className={`flex w-full justify-between py-1.5 px-5 text-left rounded-md transition
                              
                              ${
                                isUnit
                                  ? "pl-10 font-semibold text-brand-700 bg-brand-50"
                                  : "pl-10 text-sm hover:bg-surface-bright"
                              }

                              ${
                                isActive
                                  ? "bg-brand-100 font-medium text-brand-700"
                                  : ""
                              }
                            `}
                            >
                              <span className="text-xs">{entry.title}</span>
                              <span className="text-xs">{entry.page}</span>
                            </button>
                          </li>
                        );
                      },
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  );
}
