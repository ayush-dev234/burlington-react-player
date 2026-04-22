// ============================================
// PageOverlay — Shows interactive icons on a page
// ============================================

import { useMemo } from "react";
import { getPageLinks } from "@/config/pages.config";
import type { InteractiveItem } from "@/types/book.types";
import InteractiveIcon from "./InteractiveIcon";
import StickyNote from "@/components/notes/StickyNote";
import { useNotesStore } from "@/store/useNotesStore";
import { useUIStore } from "@/store/useUIStore";

interface PageOverlayProps {
  pageNum: number;
  onItemClick: (item: InteractiveItem, rect?: DOMRect) => void;
}

export default function PageOverlay({
  pageNum,
  onItemClick,
}: PageOverlayProps) {
  const notes = useNotesStore((s) => s.notes);
  const pageNotes = useMemo(() => notes.filter(n => n.pageNum === pageNum), [notes, pageNum]);
  const setActiveModal = useUIStore((s) => s.setActiveModal);

  const items = useMemo(() => {
    try {
      const allLinks = getPageLinks();
      return allLinks[String(pageNum)] || [];
    } catch {
      // Page links not loaded yet
      return [];
    }
  }, [pageNum]);

  if (items.length === 0 && pageNotes.length === 0) return null;

  return (
    <div className="absolute inset-0 z-20 pointer-events-none">
      {items.map((item, idx) => (
        <InteractiveIcon
          key={`interactive-${pageNum}-${idx}`}
          item={item}
          onClick={onItemClick}
        />
      ))}

      {pageNotes.map((note) => (
        <StickyNote 
          key={`note-${note.id}`} 
          note={note} 
          onOpenNote={(clickedNote) =>{
            useNotesStore.getState().setActiveNoteId(clickedNote.id);
            setActiveModal("notes");
          }} 
        />
      ))}
    </div>
  );
}
