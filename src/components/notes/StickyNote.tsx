import { motion, PanInfo } from "framer-motion";
import { FileText } from "lucide-react";
import { useNotesStore } from "@/store/useNotesStore";
import type { Note } from "@/types/notes.types";

interface StickyNoteProps {
  note: Note;
  onOpenNote: (note: Note) => void;
}

export default function StickyNote({ note, onOpenNote }: StickyNoteProps) {
  const updateNote = useNotesStore((s) => s.updateNote);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // If it was just a click, don't update position
    if (Math.abs(info.offset.x) < 2 && Math.abs(info.offset.y) < 2) return;

    // Approximate conversion from px to percentage based on an average page size.
    const dx = (info.offset.x / 500) * 100;
    const dy = (info.offset.y / 700) * 100;

    updateNote(note.id, {
      posX: Math.max(0, Math.min(100, note.posX + dx)),
      posY: Math.max(0, Math.min(100, note.posY + dy)),
    });
  };

  return (
    <motion.button
      drag
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      onClick={() => onOpenNote(note)}
      whileHover={{ scale: 1.1 }}
      className="absolute flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-yellow-300 pointer-events-auto shadow-md hover:bg-yellow-400"
      // Position using motion's layout logic or direct styled left/top
      style={{
        left: `${note.posX}%`,
        top: `${note.posY}%`,
        transform: "translate(-50%, -50%)",
      }}
      title="Sticky Note - Click to open"
    >
      <FileText size={18} className="text-yellow-800 pointer-events-none" />
    </motion.button>
  );
}
