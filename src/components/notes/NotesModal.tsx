// ============================================
// NotesModal — Add / edit a note for a page
// ============================================
// Behaviour:
//   - New note:  Title="Add Note",  buttons = [Close, Save]
//   - Existing:  Title="Edit Note", buttons = [Delete, Close, Save]
//   - Textarea is always editable
// ============================================

import { useState, useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useBookStore } from "@/store/useBookStore";
import { useNotesStore } from "@/store/useNotesStore";

export default function NotesModal() {
  const { activeModal, setActiveModal } = useUIStore();
  const isOpen = activeModal === "notes";

  const currentPage = useBookStore((s) => s.currentPage);
  const totalPages = useBookStore((s) => s.totalPages);
  const { addNote, updateNote, deleteNote } = useNotesStore();

  const notes = useNotesStore((s) => s.notes);
  const activeNoteId = useNotesStore((s) => s.activeNoteId);
  const setActiveNoteId = useNotesStore((s) => s.setActiveNoteId);

  const [selectedPage, setSelectedPage] = useState(currentPage);
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Derived state: are we editing an existing note?
  const isEditing = editingId !== null;

  // When the modal opens, sync to current page (OR the actively clicked note's page)
  useEffect(() => {
    if (!isOpen) return;

    let targetPage = currentPage;

    if (activeNoteId) {
      const activeNote = notes.find((n) => n.id === activeNoteId);
      if (activeNote) {
        targetPage = activeNote.pageNum;
      }
    }

    setSelectedPage(targetPage);

    const existing = notes.find((n) => n.pageNum === targetPage);
    if (existing) {
      setText(existing.text);
      setEditingId(existing.id);
    } else {
      setText("");
      setEditingId(null);
    }

    setTimeout(() => textareaRef.current?.focus(), 50);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPage, activeNoteId, notes]);

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

    setActiveNoteId(null);
    setActiveModal(null);
  };

  const handleDelete = () => {
    if (!editingId) return;
    deleteNote(editingId);
    setActiveNoteId(null);
    setActiveModal(null);
  };

  const handleClose = () => {
    setActiveNoteId(null);
    setActiveModal(null);
  };

  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-start justify-center"
      style={{ paddingTop: "7vh", background: "rgba(0,0,0,0.45)" }}
      onClick={handleClose}
    >
      {/* Dialog */}
      <div
        className="w-[92vw] sm:w-full flex flex-col overflow-hidden rounded-md shadow-2xl"
        style={{ maxWidth: 420 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Title bar ─────────────────────────────── */}
        <div
          className="flex items-center justify-between px-6 py-2"
          style={{
            background: "var(--color-brand-600, #2a5a96)",
            color: "#fff",
            userSelect: "none",
          }}
        >
          <span className="text-sm font-semibold tracking-wide">
            {isEditing ? "Edit Note" : "Add Note"}
          </span>
          <button
            onClick={handleClose}
            className="flex items-center justify-center rounded-md p-1 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Body ──────────────────────────────────── */}
        <div className="flex flex-col gap-4 px-6 py-5 bg-white">
          {/* Page selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Page
            </label>
            <select
              value={selectedPage}
              onChange={(e) => handlePageChange(Number(e.target.value))}
              className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <option key={p} value={p}>
                  Page {p}
                </option>
              ))}
            </select>
          </div>

          {/* Textarea */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Note
            </label>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your note here…"
              rows={7}
              className="w-full resize-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all leading-relaxed"
            />
          </div>
        </div>

        {/* ── Footer buttons ────────────────────────── */}
        <div
          className="flex items-center px-6 py-3 border-t border-gray-100 bg-gray-50"
        >
          {/* Left side: Delete (only when editing) */}
          <div className="flex-1">
            {isEditing && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
                title="Delete this note"
              >
                <Trash2 size={15} />
                Delete
              </button>
            )}
          </div>

          {/* Right side: Close + Save */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleClose}
              className="rounded-md border border-gray-200 bg-white px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-800 transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={!text.trim()}
              className="rounded-md px-4 py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-40"
              style={{ background: "var(--color-brand-600, #2a5a96)" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
