// ============================================
// Toolbar — Bottom toolbar with all controls
// ============================================

import { useState } from "react";
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
} from "lucide-react";
import { useBookStore } from "@/store/useBookStore";
import { useUIStore } from "@/store/useUIStore";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useFullscreen } from "@/hooks/useFullscreen";

export default function Toolbar() {
  const { isSidebarOpen, setSidebarOpen, setActiveModal } = useUIStore();
  const {
    currentPage,
    totalPages,
    setPage,
    zoomIn,
    zoomOut,
    viewMode,
    setViewMode,
  } = useBookStore();
  const { activeTool, setTool, toggleToolbar, isToolbarOpen } = useDrawingStore();
  const { soundEnabled, toggleSound } = useSettingsStore();
  const { isFullscreen, toggleFullscreen } = useFullscreen();
  const [pageInput, setPageInput] = useState("");
  const [showPageInput, setShowPageInput] = useState(false);

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

  return (
    <footer
      id="toolBox"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-50 flex h-11 items-center justify-center gap-1 rounded-full bg-white px-3 shadow-xl border border-gray-200 no-print"
    >
      {/* Table of Contents */}
      <ToolButton
        id="tool-sidebar"
        title="Table of Contents"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        <Menu size={20} />
      </ToolButton>

      <ToolSeparator />

      {/* Page Navigation */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-semibold text-gray-800 hidden sm:inline">
          Go to page
        </span>
        {showPageInput ? (
          <input
            type="text"
            className="w-16 rounded border border-gray-300 bg-gray-50 px-2 py-1 text-center text-sm font-medium text-gray-900 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
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
            className="flex items-center gap-1.5 rounded bg-gray-200/80 px-3 py-1 text-sm font-medium text-gray-800 transition-colors hover:bg-gray-300"
            title="Go to page"
          >
            <span className="tabular-nums">{currentPage}</span>
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
        <NotebookPen size={20} />
      </ToolButton>

      {/* Zoom */}
      <ToolButton id="tool-zoom-in" title="Zoom In" onClick={zoomIn}>
        <ZoomIn size={20} />
      </ToolButton>
      <ToolButton id="tool-zoom-out" title="Zoom Out" onClick={zoomOut}>
        <ZoomOut size={20} />
      </ToolButton>

      <ToolSeparator />

      {/* View Mode Toggle */}
      <ToolButton
        id="tool-bookmode-toggle"
        title={viewMode === "double" ? "Single Page" : "Double Page"}
        onClick={() => setViewMode(viewMode === "double" ? "single" : "double")}
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

      {/* Drawing Tools */}
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
        <Pen size={20} />
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
        <Highlighter size={20} />
      </ToolButton>

      <ToolSeparator />

      {/* Thumbnail */}
      <ToolButton
        id="app-tool-thumbnail"
        title="Thumbnails"
        onClick={() => useUIStore.getState().toggleThumbnailStrip()}
      >
        <Image size={20} />
      </ToolButton>
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
      className={`flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-all hover:bg-gray-100 hover:text-gray-900 active:scale-95 ${
        active ? "bg-brand-100 text-brand-600" : ""
      }`}
    >
      {children}
    </button>
  );
}

function ToolSeparator() {
  return <div className="mx-1 h-6 w-px bg-gray-200" />;
}
