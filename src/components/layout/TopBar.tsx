// ============================================
// TopBar — Header with logo, title, counters
// ============================================

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bookmark, Highlighter, StickyNote, ChevronRight } from "lucide-react";
import { getBookConfig } from "@/config/book.config";
import { useBookStore } from "@/store/useBookStore";
import { useBookmarkStore } from "@/store/useBookmarkStore";
import { useNotesStore } from "@/store/useNotesStore";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function TopBar() {
  const config = getBookConfig();
  const currentPage = useBookStore((s) => s.currentPage);
  const setPage = useBookStore((s) => s.setPage);

  return (
    <header
      id="topbar"
      className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-4 no-print"
      style={{
        background:
          "linear-gradient(135deg, #1e88e5 0%, #42a5f5 50%, #64b5f6 100%)",
      }}
    >
      {/* Left: Logo + Slogan */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src="/img/logo-icon.png"
          alt="Logo"
          className="h-9 w-auto shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <img
          src="/img/slogan.png"
          alt=""
          className="hidden h-7 w-auto sm:block"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Center: Title */}
      <h1
        id="subject-head"
        className="absolute left-1/2 -translate-x-1/2 text-base font-semibold text-white truncate max-w-[400px] hidden md:block"
      >
        {config.subject}
      </h1>

      {/* Right: Counters */}
      <div className="flex items-center gap-1">
        <BookmarkDropdown currentPage={currentPage} setPage={setPage} />
        <HighlightsDropdown setPage={setPage} />
        <NotesDropdown currentPage={currentPage} setPage={setPage} />
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
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        title="Bookmarks"
      >
        <Bookmark size={16} />
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
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        title="Highlights"
      >
        <Highlighter size={16} />
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
        className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-white/80 transition-colors hover:bg-white/20 hover:text-white"
        title="Notes"
      >
        <StickyNote size={16} />
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
      className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-[10px] font-bold text-white"
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
      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-xl overflow-hidden"
    >
      <div className="border-b border-border px-4 py-2.5">
        <h4 className="text-sm font-semibold text-on-surface">{title}</h4>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {hasChildren ? (
          <ul className="py-1">{children}</ul>
        ) : (
          <div className="px-4 py-6 text-center text-sm text-on-surface-muted">
            {emptyText}
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
        className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-surface-bright"
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
