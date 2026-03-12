// ============================================
// TopBar — Header with logo, title, counters
// ============================================
// Responsive: icon-only counters on mobile,
// full branding visible on sm+, title on md+.
// Glassmorphism effect, smooth transitions.
// ============================================

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Pencil, FileText, ChevronRight } from "lucide-react";
import { getBookConfig } from "@/config/book.config";
import { useBookStore } from "@/store/useBookStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useNotesStore } from "@/store/useNotesStore";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function TopBar() {
  const config = getBookConfig();
  const currentPage = useBookStore((s) => s.currentPage);
  const totalPages = useBookStore((s) => s.totalPages);
  const setPage = useBookStore((s) => s.setPage);

  // Reading progress percentage
  const progress =
    totalPages > 1 ? ((currentPage - 1) / (totalPages - 1)) * 100 : 0;

  return (
    <header id="topbar" className="fixed top-0 left-0 right-0 z-50 no-print">
      {/* Main Bar */}
      <div className="flex h-11 items-center justify-between bg-[#42a5e8] relative shadow-sm">
        {/* Slanted White Background */}
        <div
          className="absolute left-0 top-0 h-full w-[80px] sm:w-[350px] bg-white z-0 transition-all duration-300"
          style={{
            clipPath: "polygon(0 0, 100% 0, calc(100% - 35px) 100%, 0 100%)",
          }}
        />

        {/* Left: Logo + Branding */}
        <div className="relative z-10 flex items-center gap-2 sm:gap-2.5 pl-3 sm:pl-4 min-w-0 h-full">
          <img
            src="/img/logo-icon.png"
            alt="Logo"
            className="h-7 sm:h-8 w-auto shrink-0 drop-shadow-sm transition-all duration-200"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <div className="hidden sm:flex flex-col leading-tight mt-0.5">
            <span
              className="text-[14px] font-bold tracking-wide text-[#1A4C84] whitespace-nowrap"
              style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
            >
              BURLINGTON<span className="text-[#3EA1E1]">ENGLISH</span>
              <sup className="text-[8px] ml-0.5 text-[#1A4C84]">®</sup>
            </span>
            <span className="text-[8px] font-semibold tracking-[0.08em] text-[#1A4C84] uppercase mt-px whitespace-nowrap">
              The Publisher That Cares
            </span>
          </div>
        </div>

        {/* Center: Title */}
        <h1
          id="subject-head"
          className="absolute z-10 left-1/2 -translate-x-1/2 text-[14px] md:text-[17px] font-medium text-white shadow-black/10 drop-shadow-sm truncate max-w-[180px] sm:max-w-[300px] md:max-w-[400px] hidden sm:block transition-all duration-300"
          style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
        >
          {config.subject}
        </h1>

        {/* Right: Counters */}
        <div className="relative z-30 flex items-center gap-2 sm:gap-3 md:gap-5 pr-4 sm:pr-6 md:pr-20">
          <BookmarkDropdown currentPage={currentPage} setPage={setPage} />
          <HighlightsDropdown setPage={setPage} />
          <NotesDropdown currentPage={currentPage} setPage={setPage} />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-[4px] w-full bg-[#1a6da0] relative z-20">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #4caf50, #66bb6a, #81c784)",
          }}
        />
      </div>
    </header>
  );
}

// ── Bookmark Dropdown ────────────────────────────────────────────────
function BookmarkDropdown({
  currentPage: _currentPage,
  setPage,
}: {
  currentPage: number;
  setPage: (p: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const bookmarks = useBookmarkStore((s) => s.bookmarks);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        id="app-list-bookmark"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2 rounded px-1 sm:px-1.5 py-1 text-white/90 transition-all duration-200 hover:text-white hover:bg-white/10 active:scale-95"
        title="Bookmarks"
      >
        <Bookmark size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
        <CountBadge count={bookmarks.length} id="total-bookmarks" />
      </button>

      <AnimatePresence>
        {open && (
          <DropdownPanel title="Bookmarks" emptyText="No Bookmarks Yet.">
            {bookmarks.map((page) => (
              <DropdownItem
                key={page}
                label={`Page ${page}`}
                onClick={() => {
                  setPage(page);
                  setOpen(false);
                }}
              />
            ))}
          </DropdownPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Highlights Dropdown ──────────────────────────────────────────────
function HighlightsDropdown({ setPage }: { setPage: (p: number) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canvasData = useDrawingStore((s) => s.canvasData);
  const highlightedPages = Object.keys(canvasData)
    .map(Number)
    .sort((a, b) => a - b);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        id="app-list-highlights"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2 rounded px-1 sm:px-1.5 py-1 text-white/90 transition-all duration-200 hover:text-white hover:bg-white/10 active:scale-95"
        title="Highlights"
      >
        <Pencil size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
        <CountBadge count={highlightedPages.length} id="total-highlights" />
      </button>

      <AnimatePresence>
        {open && (
          <DropdownPanel title="Highlights" emptyText="No Highlights Yet.">
            {highlightedPages.map((page) => (
              <DropdownItem
                key={page}
                label={`Page ${page}`}
                onClick={() => {
                  setPage(page);
                  setOpen(false);
                }}
              />
            ))}
          </DropdownPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Notes Dropdown ───────────────────────────────────────────────────
function NotesDropdown({
  currentPage: _currentPage,
  setPage,
}: {
  currentPage: number;
  setPage: (p: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const notes = useNotesStore((s) => s.notes);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        id="app-list-notes"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 sm:gap-2 rounded px-1 sm:px-1.5 py-1 text-white/90 transition-all duration-200 hover:text-white hover:bg-white/10 active:scale-95"
        title="Notes"
      >
        <FileText size={18} strokeWidth={1.5} className="sm:w-5 sm:h-5" />
        <CountBadge count={notes.length} id="total-notes" />
      </button>

      <AnimatePresence>
        {open && (
          <DropdownPanel title="Notes" emptyText="No Notes Yet.">
            {notes.map((note) => (
              <DropdownItem
                key={note.id}
                label={`Page ${note.pageNum}`}
                subtitle={
                  note.text.length > 40
                    ? note.text.slice(0, 40) + "…"
                    : note.text
                }
                onClick={() => {
                  setPage(note.pageNum);
                  setOpen(false);
                }}
              />
            ))}
          </DropdownPanel>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Shared Sub-Components ────────────────────────────────────────────

function CountBadge({ count, id }: { count: number; id: string }) {
  return (
    <span
      id={id}
      className="inline-flex h-[20px] sm:h-[22px] min-w-[20px] sm:min-w-[22px] items-center justify-center rounded-[3px] bg-[#0284c7] px-1 text-[11px] sm:text-[13px] font-semibold text-white tabular-nums drop-shadow-sm transition-all duration-200"
    >
      {count}
    </span>
  );
}

function DropdownPanel({
  title,
  emptyText,
  children,
}: {
  title: string;
  emptyText: string;
  children: React.ReactNode;
}) {
  const hasChildren = Array.isArray(children)
    ? children.length > 0
    : !!children;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-56 sm:w-64 rounded-xl border border-border bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden z-60"
    >
      <div className="border-b border-border px-4 py-2.5">
        <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {hasChildren ? (
          <ul className="py-1">{children}</ul>
        ) : (
          <div className="px-4 py-6 text-center">
            <div className="text-2xl mb-2 opacity-40">
              {title === "Bookmarks" ? "🔖" : title === "Notes" ? "📝" : "✏️"}
            </div>
            <span className="text-sm text-on-surface-muted">{emptyText}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function DropdownItem({
  label,
  subtitle,
  onClick,
}: {
  label: string;
  subtitle?: string;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-all duration-200 hover:bg-surface-bright active:scale-[0.98]"
      >
        <ChevronRight size={14} className="shrink-0 text-brand-500" />
        <div className="min-w-0">
          <div className="font-medium text-on-surface">{label}</div>
          {subtitle && (
            <div className="truncate text-xs text-on-surface-muted">
              {subtitle}
            </div>
          )}
        </div>
      </button>
    </li>
  );
}
