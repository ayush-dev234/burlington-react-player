// ============================================
// TopBar — Header with logo, title, counters
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
          className="absolute left-0 top-0 h-full w-[100px] sm:w-[350px] bg-white z-0"
          style={{
            clipPath: "polygon(0 0, 100% 0, calc(100% - 35px) 100%, 0 100%)",
          }}
        />

        {/* Left: Logo + Branding */}
        <div className="relative z-10 flex items-center gap-2.5 pl-4 min-w-0 h-full">
          <img
            src="/img/logo-icon.png"
            alt="Logo"
            className="h-8 w-auto shrink-0 drop-shadow-sm"
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
          className="absolute z-10 left-1/2 -translate-x-1/2 text-[17px] font-medium text-white shadow-black/10 drop-shadow-sm truncate max-w-[400px] hidden md:block"
          style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
        >
          {config.subject}
        </h1>

        {/* Right: Counters */}
        <div className="relative z-30 flex items-center gap-5 pr-20">
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
        className="flex items-center gap-2 rounded px-1.5 py-1 text-white/90 transition-colors hover:text-white hover:bg-white/10"
        title="Bookmarks"
      >
        <Bookmark size={20} strokeWidth={1.5} />
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
        className="flex items-center gap-2 rounded px-1.5 py-1 text-white/90 transition-colors hover:text-white hover:bg-white/10"
        title="Highlights"
      >
        <Pencil size={20} strokeWidth={1.5} />
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
        className="flex items-center gap-2 rounded px-1.5 py-1 text-white/90 transition-colors hover:text-white hover:bg-white/10"
        title="Notes"
      >
        <FileText size={20} strokeWidth={1.5} />
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
      className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[3px] bg-[#0284c7] px-1 text-[13px] font-semibold text-white tabular-nums drop-shadow-sm"
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
      className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-surface shadow-xl overflow-hidden z-60"
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
