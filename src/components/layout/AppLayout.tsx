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
            animate={{ opacity: 0.7, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ opacity: 1 }}
            onClick={() => useUIStore.getState().setBookOnlyMode(false)}
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-lg transition-all active:scale-95"
            style={{ background: "var(--color-brand-600, #2a5a96)" }}
            title="Exit book-only mode"
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 14 10 14 10 20" />
              <polyline points="20 10 14 10 14 4" />
              <line x1="14" y1="10" x2="21" y2="3" />
              <line x1="3" y1="21" x2="10" y2="14" />
            </svg>
            Exit
          </motion.button>
        )}
      </AnimatePresence>

      <NotesModal />
    </div>
  );
}
