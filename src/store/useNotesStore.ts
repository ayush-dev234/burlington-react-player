// // ============================================
// // Notes Store — CRUD with localStorage persistence
// // ============================================
// // Bug fix: getNotes() always requires pageNum parameter
// // (original code called it without args in updateNote())
// // ============================================


import { create } from "zustand";
import type { Note } from "@/types/notes.types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface NotesState {
  notes: Note[];
  activeNoteId: string | null;

  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => void;
  deleteNote: (id: string) => void;
  getNotesForPage: (pageNum: number) => Note[];
  totalCount: () => number;
  setActiveNoteId: (id: string | null) => void;
  /** Re-read notes from localStorage (call after STORAGE_PREFIX is set) */
  rehydrate: () => void;
}

const STORAGE_KEY = "notes";

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function persistNotes(notes: Note[]): void {
  setStorageItem(STORAGE_KEY, notes);
}

export const useNotesStore = create<NotesState>((set, get) => ({
  // Load notes from localStorage
  notes: getStorageItem<Note[]>(STORAGE_KEY, []),
  activeNoteId: null,
  setActiveNoteId: (id) => set({ activeNoteId: id }),
  addNote: (noteData) => {
    const now = Date.now();

    const newNote: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    set((state) => {
      const updated = [...state.notes, newNote];
      persistNotes(updated);
      return { notes: updated };
    });
  },

  updateNote: (id, updates) => {
    set((state) => {
      const updated = state.notes.map((note) =>
        note.id === id
          ? { ...note, ...updates, updatedAt: Date.now() }
          : note
      );

      persistNotes(updated);
      return { notes: updated };
    });
  },

  deleteNote: (id) => {
    set((state) => {
      const updated = state.notes.filter((note) => note.id !== id);
      persistNotes(updated);
      return { notes: updated };
    });
  },

  getNotesForPage: (pageNum) => {
    return get().notes.filter((note) => note.pageNum === pageNum);
  },

  totalCount: () => get().notes.length,

  rehydrate: () => {
    const fresh = getStorageItem<Note[]>(STORAGE_KEY, []);
    set({ notes: fresh });
  },
}));