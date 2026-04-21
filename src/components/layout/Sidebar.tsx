// ============================================
// Sidebar — Table of Contents
// ============================================

import { useRef, useState} from "react";
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
  const [showToc, setShowToc] = useState(false);
  const [showVideoToc, setVideoToc] = useState(false)
  const [showInteractivesToc, setInteractivesToc] = useState(false)
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
  console.log(tocEntries)
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
            className="fixed left-0 top-0 bottom-0 z-70 flex w-full sm:w-80 max-w-[100vw] mt-100 p-10 sm:max-w-[85vw] flex-col bg-surface shadow-2xl pr-3 no-print"
            role="navigation"
            aria-label="Table of Contents"

          >
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-10 p-10">
              <h2 className="text-lg font-semibold text-on-surface">
                Contents
              </h2>

              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-md p-2 text-on-surface-muted transition-colors hover:bg-surface-bright hover:text-on-surface"
                aria-label="Close sidebar"
              >
                <X size={22} />
              </button>
            </div>
            <div className="px-4 py-3 border-b border-border">
            <button
                onClick={() => setShowToc(!showToc)}
                className="flex w-full items-center justify-between rounded-md bg-surface-bright px-3 py-2 text-sm font-medium hover:bg-surface"
              >
                <span className="p-5"> Table of Contents</span>
                <span className="text-gray-300">{showToc ? "▼" : "▶"}</span>
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
                    {tocEntries.map((entry:any, index:number) => {
                      const isActive = currentPage === entry.page;
                      const isUnit = entry.isUnitHeader;

                      return (
                        <li key={`${entry.page}-${index}`}>
                          <button
                            onClick={() => handleNavigation(entry.page)}
                            className={`flex w-full justify-between py-2 pr-6 p-5 text-left rounded-md transition
                              
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
             <button
                onClick={() => setVideoToc(!showVideoToc)}
                className="flex w-full items-center justify-between rounded-md bg-surface-bright px-3 py-2 text-sm font-medium hover:bg-surface"
              >
                <span className="p-5">Animations</span>
                <span className="text-gray-300">{showVideoToc ? "▼" : "▶"}</span>
            </button>
            <AnimatePresence>
              {showVideoToc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-auto"
                >
                  <ul className="space-y-1 px-1">
                    {tocEntries?.map((entry:any, index:number) => {
                      const isActive = currentPage === entry.page;
                      const isUnit = entry.isUnitHeader;

                      return (
                        <li key={`${entry.page}-${index}`}>
                          <button
                            onClick={() => handleNavigation(entry.page)}
                            className={`flex w-full justify-between py-2 pr-6 text-left p-5 rounded-md transition
                              
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
             <button
                onClick={() => setInteractivesToc(!showInteractivesToc)}
                className="flex w-full items-center justify-between rounded-md bg-surface-bright px-3 py-2 text-sm font-medium hover:bg-surface"
              >
                <span className="p-5">Interactivities</span>
                <span className="text-gray-300">{showInteractivesToc ? "▼" : "▶"}</span>
            </button>
            <AnimatePresence>
              {showInteractivesToc && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-auto"
                >
                  <ul className="space-y-1 px-1">
                    {(tocEntries as any)?.interactiveToc?.map((entry:any, index:number) => {
                      const isActive = currentPage === entry.page;
                      const isUnit = entry.isUnitHeader;

                      return (
                        <li key={`${entry.page}-${index}`}>
                          <button
                            onClick={() => handleNavigation(entry.page)}
                            className={`flex w-full justify-between py-2 pr-6 text-left p-5 rounded-md transition
                              
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
                    })}
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