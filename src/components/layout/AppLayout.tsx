// ============================================
// AppLayout — Main layout wrapper
// ============================================
// Composes: TopBar + Sidebar + BookViewer + Toolbar
// Handles book-only mode, keyboard shortcuts
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import TopBar from "./TopBar";
import Sidebar from "./Sidebar";
import Toolbar from "./Toolbar";
import BookViewer from "@/components/book/BookViewer";
import NotesModal from "@/components/notes/NotesModal";
import { useUIStore } from "@/store/useUIStore";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useResponsive } from "@/hooks/useResponsive";

export default function AppLayout() {
  const isBookOnlyMode = useUIStore((s) => s.isBookOnlyMode);
  const { isMobile } = useResponsive();

  // Register keyboard shortcuts
  useKeyboardShortcuts();

  return (
    <div
      id="wrapper"
      className="relative flex h-screen w-screen flex-col overflow-hidden bg-surface-dim"
    >
      {/* Top Bar — hidden in book-only mode */}
      <AnimatePresence>
        {!isBookOnlyMode && (
          <motion.div
            initial={{ y: -56 }}
            animate={{ y: 0 }}
            exit={{ y: -56 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <TopBar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main
        id="page-wrapper"
        className="flex flex-1 overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: "#e0e4e8",
          paddingTop: isBookOnlyMode ? 0 : 48,
          paddingBottom: isBookOnlyMode ? 0 : (isMobile ? 48 : 56),
        }}
      >
        <BookViewer />
      </main>

      {/* Bottom Toolbar — hidden in book-only mode */}
      <AnimatePresence>
        {!isBookOnlyMode && (
          <motion.div
            initial={{ y: 48 }}
            animate={{ y: 0 }}
            exit={{ y: 48 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <Toolbar />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit book-only mode button */}
      <AnimatePresence>
        {isBookOnlyMode && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => useUIStore.getState().setBookOnlyMode(false)}
            className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 z-50 flex items-center gap-1.5 sm:gap-2 rounded-full bg-black/60 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white backdrop-blur-sm transition-all hover:bg-black/80 active:scale-95"
            title="Exit book-only mode"
          >
            <svg width={14} height={14} viewBox="0 0 16 16" fill="currentColor" className="sm:w-4 sm:h-4">
              <path
                fillRule="evenodd"
                d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707m4.344 0a.5.5 0 0 1 .707 0l4.096 4.096V11.5a.5.5 0 1 1 1 0v3.975a.5.5 0 0 1-.5.5H11.5a.5.5 0 0 1 0-1h2.768l-4.096-4.096a.5.5 0 0 1 0-.707m0-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707m-4.344 0a.5.5 0 0 1-.707 0L1.025 1.732V4.5a.5.5 0 0 1-1 0V.525a.5.5 0 0 1 .5-.5H4.5a.5.5 0 0 1 0 1H1.732l4.096 4.096a.5.5 0 0 1 0 .707"
              />
            </svg>
            <span className="hidden xs:inline">Exit</span>
          </motion.button>
        )}
      </AnimatePresence>

      <NotesModal />
    </div>
  );
}
