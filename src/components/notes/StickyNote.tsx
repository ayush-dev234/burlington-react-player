import { useRef } from "react";
import { FileText } from "lucide-react";
import { useNotesStore } from "@/store/useNotesStore";
import type { Note } from "@/types/notes.types";

interface StickyNoteProps {
  note: Note;
  onOpenNote: (note: Note) => void;
}

export default function StickyNote({ note, onOpenNote }: StickyNoteProps) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const isDraggingRef = useRef(false);
  const noteRef = useRef<HTMLButtonElement>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    isDraggingRef.current = false;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      isDraggingRef.current = true;
    }

    if (isDraggingRef.current && noteRef.current) {
      // Apply visual transform during drag
      noteRef.current.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    e.stopPropagation();
    if (!dragStartRef.current) return;

    if (isDraggingRef.current) {
      // Compute the percentage offset
      const parentEl = noteRef.current?.parentElement;
      if (parentEl) {
        const rect = parentEl.getBoundingClientRect();
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const dxPercent = (dx / rect.width) * 100;
        const dyPercent = (dy / rect.height) * 100;

        updateNote(note.id, {
          posX: Math.max(0, Math.min(100, note.posX + dxPercent)),
          posY: Math.max(0, Math.min(100, note.posY + dyPercent)),
        });
      }
      // Reset transform — new position will be applied via CSS left/top on re-render
      if (noteRef.current) {
        noteRef.current.style.transform = "translate(-50%, -50%)";
      }
    } else {
      // It was a click, not a drag
      onOpenNote(note);
    }

    dragStartRef.current = null;
    isDraggingRef.current = false;
  };

  return (
    <button
      ref={noteRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
      className="absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-yellow-300 pointer-events-auto shadow-md hover:bg-yellow-400 hover:scale-110 transition-transform"
      style={{
        left: `${note.posX}%`,
        top: `${note.posY}%`,
        transform: "translate(-50%, -50%)",
      }}
      title="Sticky Note - Click to open"
    >
      <FileText size={18} className="text-yellow-800 pointer-events-none" />
    </button>
  );
}
