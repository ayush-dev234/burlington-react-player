// ============================================
// NotesModal — Add / edit a note for a page
// ============================================
// UI modelled after the original HTML player's "Add note" dialog:
//   - Title bar with close (×)
//   - Page selector dropdown
//   - Large textarea
//   - Close | Save buttons
// ============================================

import { useState, useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";
import { useBookStore } from "@/store/useBookStore";
import { useNotesStore } from "@/store/useNotesStore";

export default function NotesModal() {
  const { activeModal, setActiveModal } = useUIStore();
  const isOpen = activeModal === "notes";

  const currentPage = useBookStore((s) => s.currentPage);
  const totalPages  = useBookStore((s) => s.totalPages);
  // const { notes, addNote, updateNote } = useNotesStore();
  const { addNote, updateNote } = useNotesStore();
  const [selectedPage, setSelectedPage] = useState(currentPage);

  const notes = useNotesStore((s) => s.notes);
  // const notesForPage = notes.filter((n) => n.pageNum === selectedPage);

  // Which page we're editing a note for
  
  // The text in the textarea
  const [text, setText] = useState("");
  // If we're editing an existing note, store its id
  const [editingId, setEditingId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // When the modal opens, sync to current page and load existing note if any
  useEffect(() => {
  if (!isOpen) return;

  const page = currentPage;
  setSelectedPage(page);

  const existing =notes.find((n) => n.pageNum === selectedPage);// pick first note for simplicity
  if (existing) {
    setText(existing.text);
    setEditingId(existing.id);
  } else {
    setText("");
    setEditingId(null);
  }

  setTimeout(() => textareaRef.current?.focus(), 50);
},  [isOpen, currentPage, selectedPage]);

  // When user switches the page dropdown, load note for that page
  const handlePageChange = (page: number) => {
    setSelectedPage(page);

  const existing = useNotesStore.getState().getNotesForPage(page)[0];

  if (existing) {
    setText(existing.text);
    setEditingId(existing.id);
  } else {
    setText("");
    setEditingId(null);
  }
  };

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (editingId) {
      updateNote(editingId, { text: trimmed });
    } else {
      addNote({
        pageNum: selectedPage,
        text: trimmed,
        posX: 10 + Math.random() * 30,
        posY: 10 + Math.random() * 30,
      });
    }

    setActiveModal(null);
  };

  const handleClose = () => setActiveModal(null);

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-start justify-center"
      style={{ paddingTop: "5vh", background: "rgba(0,0,0,0.45)" }}
      onClick={handleClose}
    >
      {/* Dialog */}
      <div
        className="w-[95vw] sm:w-full flex flex-col overflow-hidden rounded-md shadow-2xl"
        style={{ maxWidth: 400, background: "#fff" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Title bar ─────────────────────────────── */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            background: "#555",
            color: "#fff",
            userSelect: "none",
          }}
        >
          <span className="text-sm font-semibold tracking-wide">Add note</span>
          <button
            onClick={handleClose}
            className="text-white/80 hover:text-white text-lg leading-none transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* ── Body ──────────────────────────────────── */}
        <div className="flex flex-col gap-3 p-4" style={{ background: "#f4f4f4" }}>
          {/* Page selector */}
          <select
            value={selectedPage}
            onChange={(e) => handlePageChange(Number(e.target.value))}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <option key={p} value={p}>
                Page {p}
              </option>
            ))}
          </select>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your note here…"
            rows={8}
            className="w-full resize-none rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-300"
          />
        </div>

        {/* ── Footer buttons ────────────────────────── */}
        <div
          className="flex items-center justify-end gap-2 px-4 py-3 border-t border-gray-200"
          style={{ background: "#f4f4f4" }}
        >
          <button
            onClick={handleClose}
            className="rounded border border-gray-300 bg-white px-5 py-1.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={!text.trim()}
            className="rounded bg-gray-600 px-5 py-1.5 text-sm font-medium text-white hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
