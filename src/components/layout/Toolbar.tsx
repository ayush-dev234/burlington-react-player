// ============================================
// Toolbar — Bottom toolbar with all controls
// ============================================
// Responsive: full toolbar on desktop, condensed
// with "More" overflow menu on mobile/tablet.
// Glassmorphism effect, micro-animations on click.
// ============================================

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Menu,
  NotebookPen,
  ZoomIn,
  ZoomOut,
  BookOpen,
  FileText,
  Maximize,
  Minimize,
  Focus,
  Pen,
  Highlighter,
  Image,
  Volume2,
  VolumeX,
  MoreHorizontal,
  X,
  BarChart3,
} from "lucide-react";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useFullscreen } from "@/hooks/useFullscreen";
import { useResponsive } from "@/hooks/useResponsive";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Toolbar() {
  const { isSidebarOpen, setSidebarOpen, setActiveModal, isTrackerVisible, toggleTracker } = useUIStore();
  const {
    currentPage,
    totalPages,
    setPage,
    zoomIn,
    zoomOut,
    viewMode,
    setViewMode,
  } = useBookStore();
  const { activeTool, setTool, toggleToolbar, isToolbarOpen } =
    useDrawingStore();
  const { soundEnabled, toggleSound } = useSettingsStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const { isMobile } = useResponsive();
  const [pageInput, setPageInput] = useState("");
  const [showPageInput, setShowPageInput] = useState(false);
  const [showOverflow, setShowOverflow] = useState(false);
  const overflowRef = useRef<HTMLDivElement>(null);

  useClickOutside(overflowRef, () => setShowOverflow(false), showOverflow);

  const handlePageNavigate = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const num = parseInt(pageInput, 10);
      if (!isNaN(num) && num >= 1 && num <= totalPages) {
        setPage(num);
        setShowPageInput(false);
        setPageInput("");
      }
    }
  };

  // ── Overflow items (shown in "More" menu on mobile) ──────────────────
  const overflowItems = (
    <>
      {/* View Mode Toggle */}
      <OverflowItem
        label={viewMode === "double" ? "Single Page" : "Double Page"}
        icon={
          viewMode === "double" ? (
            <FileText size={18} />
          ) : (
            <BookOpen size={18} />
          )
        }
        onClick={() => {
          setViewMode(viewMode === "double" ? "single" : "double");
          setShowOverflow(false);
        }}
      />

      {/* Fullscreen */}
      <OverflowItem
        label={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        icon={isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        onClick={() => {
          toggleFullscreen();
          setShowOverflow(false);
        }}
      />

      {/* Book Only Preview */}
      <OverflowItem
        label="Book Only Mode"
        icon={<Focus size={18} />}
        onClick={() => {
          const ui = useUIStore.getState();
          ui.setBookOnlyMode(!ui.isBookOnlyMode);
          setShowOverflow(false);
        }}
      />

      {/* Spotlight */}
      <OverflowItem
        label="Spotlight"
        icon={
          <svg width={18} height={18} viewBox="0 0 20 20" fill="currentColor">
            <path d="M3.86 7.847a.5.5 0 0 0-.72-.694L1.399 8.959a1.5 1.5 0 0 0 0 2.082l1.74 1.807a.5.5 0 0 0 .72-.694l-1.74-1.807a.5.5 0 0 1 0-.694zM7.152 3.14a.5.5 0 1 0 .694.72l1.806-1.74a.5.5 0 0 1 .694 0l1.806 1.74a.5.5 0 0 0 .694-.719L11.04 1.4a1.5 1.5 0 0 0-2.082 0zm9.707 4.012a.5.5 0 1 0-.72.694l1.746 1.811a.5.5 0 0 1 0 .695l-1.745 1.8a.5.5 0 0 0 .718.696l1.744-1.8a1.5 1.5 0 0 0 .003-2.085zM7.846 16.14a.5.5 0 1 0-.694.72l1.812 1.745a1.5 1.5 0 0 0 2.084-.003l1.799-1.743a.5.5 0 1 0-.696-.718l-1.799 1.743a.5.5 0 0 1-.694 0zM8 6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM7 8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
          </svg>
        }
        onClick={() => {
          setActiveModal("spotlight");
          setShowOverflow(false);
        }}
      />

      {/* Sound Toggle */}
      <OverflowItem
        label={soundEnabled ? "Sound On" : "Sound Off"}
        icon={soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        onClick={() => {
          toggleSound();
          setShowOverflow(false);
        }}
      />

      {/* Thumbnails */}
      <OverflowItem
        label="Thumbnails"
        icon={<Image size={18} />}
        onClick={() => {
          useUIStore.getState().toggleThumbnailStrip();
          setShowOverflow(false);
        }}
      />

      {/* Tracker Toggle */}
      <OverflowItem
        label="Progress Tracker"
        icon={<BarChart3 size={18} />}
        onClick={() => {
          useUIStore.getState().toggleTracker();
          setShowOverflow(false);
        }}
      />
    </>
  );

  return (
    <footer
      id="toolBox"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex h-11 items-center justify-center gap-0.5 sm:gap-1 rounded-full bg-white/85 backdrop-blur-xl px-2 sm:px-3 shadow-[0_4px_30px_rgba(0,0,0,0.12)] border border-gray-200/60 no-print transition-all duration-300 max-w-[96vw]"
    >
      {/* Table of Contents */}
      <ToolButton
        id="tool-sidebar"
        title="Table of Contents"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={isMobile ? 18 : 20} />
      </ToolButton>

      <ToolSeparator />

      {/* Page Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2 px-0.5 sm:px-1 whitespace-nowrap">
        <span className="text-sm font-semibold text-gray-800 hidden md:inline whitespace-nowrap">
          Go to page
        </span>
        {showPageInput ? (
          <input
            type="text"
            className="w-14 sm:w-16 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-sm font-medium text-gray-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all"
            value={pageInput}
            onChange={(e) => setPageInput(e.target.value)}
            onKeyUp={handlePageNavigate}
            onBlur={() => {
              setShowPageInput(false);
              setPageInput("");
            }}
            autoFocus
            placeholder="pg"
          />
        ) : (
          <button
            onClick={() => setShowPageInput(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded bg-gray-200/80 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-gray-800 transition-all hover:bg-gray-300 active:scale-95"
            title="Go to page"
          >
            <span className="tabular-nums whitespace-nowrap">
              {viewMode === "double"
                ? `${currentPage}-${Math.min(currentPage + 1, totalPages)}`
                : currentPage}
            </span>
            <span className="text-gray-500 font-normal">/</span>
            <span id="totalPages" className="tabular-nums">
              {totalPages}
            </span>
          </button>
        )}
      </div>

      <ToolSeparator />

      {/* Add Note */}
      <ToolButton
        id="ebook-addnote"
        title="Add Notes"
        onClick={() => setActiveModal("notes")}
      >
        <NotebookPen size={isMobile ? 18 : 20} />
      </ToolButton>

      {/* Zoom */}
      <ToolButton id="tool-zoom-in" title="Zoom In" onClick={zoomIn}>
        <ZoomIn size={isMobile ? 18 : 20} />
      </ToolButton>
      <ToolButton id="tool-zoom-out" title="Zoom Out" onClick={zoomOut}>
        <ZoomOut size={isMobile ? 18 : 20} />
      </ToolButton>

      <ToolSeparator />

      {/* Drawing Tools — always visible */}
      <ToolButton
        id="app-tool-pen"
        title="Pen"
        active={activeTool === "pen"}
        onClick={() => {
          if (activeTool === "pen") {
            setTool("none");
            if (isToolbarOpen) toggleToolbar();
          } else {
            setTool("pen");
            if (!isToolbarOpen) toggleToolbar();
          }
        }}
      >
        <Pen size={isMobile ? 18 : 20} />
      </ToolButton>
      <ToolButton
        id="app-tool-highlight"
        title="Highlighter"
        active={activeTool === "highlighter"}
        onClick={() => {
          if (activeTool === "highlighter") {
            setTool("none");
            if (isToolbarOpen) toggleToolbar();
          } else {
            setTool("highlighter");
            if (!isToolbarOpen) toggleToolbar();
          }
        }}
      >
        <Highlighter size={isMobile ? 18 : 20} />
      </ToolButton>

      {/* ── Desktop-only buttons ──────────────────────────────────── */}
      {!isMobile && (
        <>
          <ToolSeparator />

          {/* View Mode Toggle */}
          <ToolButton
            id="tool-bookmode-toggle"
            title={viewMode === "double" ? "Single Page" : "Double Page"}
            onClick={() =>
              setViewMode(viewMode === "double" ? "single" : "double")
            }
          >
            {viewMode === "double" ? (
              <FileText size={20} />
            ) : (
              <BookOpen size={20} />
            )}
          </ToolButton>

          {/* Fullscreen */}
          <ToolButton
            id="app-btn-fullscreen"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </ToolButton>

          {/* Book Only Preview */}
          <ToolButton
            id="app-btn-toggleres"
            title="Show Book Only"
            onClick={() => {
              const ui = useUIStore.getState();
              ui.setBookOnlyMode(!ui.isBookOnlyMode);
            }}
          >
            <Focus size={20} />
          </ToolButton>

          {/* Spotlight */}
          <ToolButton
            id="app-btn-spotlight"
            title="Spotlight"
            onClick={() => setActiveModal("spotlight")}
          >
            <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor">
              <path d="M3.86 7.847a.5.5 0 0 0-.72-.694L1.399 8.959a1.5 1.5 0 0 0 0 2.082l1.74 1.807a.5.5 0 0 0 .72-.694l-1.74-1.807a.5.5 0 0 1 0-.694zM7.152 3.14a.5.5 0 1 0 .694.72l1.806-1.74a.5.5 0 0 1 .694 0l1.806 1.74a.5.5 0 0 0 .694-.719L11.04 1.4a1.5 1.5 0 0 0-2.082 0zm9.707 4.012a.5.5 0 1 0-.72.694l1.746 1.811a.5.5 0 0 1 0 .695l-1.745 1.8a.5.5 0 0 0 .718.696l1.744-1.8a1.5 1.5 0 0 0 .003-2.085zM7.846 16.14a.5.5 0 1 0-.694.72l1.812 1.745a1.5 1.5 0 0 0 2.084-.003l1.799-1.743a.5.5 0 1 0-.696-.718l-1.799 1.743a.5.5 0 0 1-.694 0zM8 6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM7 8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z" />
            </svg>
          </ToolButton>

          <ToolSeparator />

          {/* Sound Toggle */}
          <ToolButton
            id="soundToggle"
            title="Page Flip Sound"
            onClick={toggleSound}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </ToolButton>

          {/* Thumbnail */}
          <ToolButton
            id="app-tool-thumbnail"
            title="Thumbnails"
            onClick={() => useUIStore.getState().toggleThumbnailStrip()}
          >
            <Image size={20} />
          </ToolButton>

          {/* Tracker Toggle */}
          <ToolButton
            id="app-tool-tracker"
            title="Progress Tracker"
            active={isTrackerVisible}
            onClick={toggleTracker}
          >
            <BarChart3 size={20} />
          </ToolButton>
        </>
      )}

      {/* ── Mobile "More" overflow menu ──────────────────────────── */}
      {isMobile && (
        <div ref={overflowRef} className="relative">
          <ToolSeparator />
          <ToolButton
            id="tool-more"
            title="More"
            onClick={() => setShowOverflow(!showOverflow)}
            active={showOverflow}
          >
            {showOverflow ? <X size={18} /> : <MoreHorizontal size={18} />}
          </ToolButton>

          <AnimatePresence>
            {showOverflow && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-full right-0 mb-3 w-52 rounded-xl bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-200/60 overflow-hidden py-1"
              >
                {overflowItems}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </footer>
  );
}

// ── Sub-Components ───────────────────────────────────────────────────

function ToolButton({
  id,
  title,
  onClick,
  children,
  active,
}: {
  id: string;
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      id={id}
      onClick={onClick}
      title={title}
      className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-90 focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-1 ${
        active ? "bg-brand-100 text-brand-600 shadow-inner" : ""
      }`}
    >
      {children}
    </button>
  );
}

function ToolSeparator() {
  return <div className="mx-0.5 sm:mx-1 h-5 sm:h-6 w-px bg-gray-200/80" />;
}

function OverflowItem({
  label,
  icon,
  onClick,
}: {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-gray-700 transition-all hover:bg-gray-50 active:bg-gray-100 active:scale-[0.98]"
    >
      <span className="text-gray-500">{icon}</span>
      {label}
    </button>
  );
}
