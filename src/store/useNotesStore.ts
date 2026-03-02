// ============================================
// Notes Store — CRUD with localStorage persistence
// ============================================
// Bug fix: getNotes() always requires pageNum parameter
// (original code called it without args in updateNote())
// ============================================

import { create } from "zustand";
import type { Note } from "@/types/notes.types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface NotesState {
  notes: Note[];

  // Actions
  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => void;
  deleteNote: (id: string) => void;
  getNotesForPage: (pageNum: number) => Note[];
  totalCount: () => number;
}

function generateId(): string {
  return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function persistNotes(notes: Note[]): void {
  setStorageItem("notes", notes);
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: getStorageItem<Note[]>("notes", []),

  addNote: (noteData) => {
    const now = Date.now();
    const newNote: Note = {
      ...noteData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    set((s) => {
      const updated = [...s.notes, newNote];
      persistNotes(updated);
      return { notes: updated };
    });
  },

  updateNote: (id, updates) => {
    set((s) => {
      const updated = s.notes.map((n) =>
        n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
      );
      persistNotes(updated);
      return { notes: updated };
    });
  },

  deleteNote: (id) => {
    set((s) => {
      const updated = s.notes.filter((n) => n.id !== id);
      persistNotes(updated);
      return { notes: updated };
    });
  },

  getNotesForPage: (pageNum) => {
    return get().notes.filter((n) => n.pageNum === pageNum);
  },

  totalCount: () => get().notes.length,
}));
