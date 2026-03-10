// // ============================================
// // Notes Store — CRUD with localStorage persistence
// // ============================================
// // Bug fix: getNotes() always requires pageNum parameter
// // (original code called it without args in updateNote())
// // ============================================

// import { create } from "zustand";
// import type { Note } from "@/types/notes.types";
// import { getStorageItem, setStorageItem } from "@/utils/storage";

// interface NotesState {
//   notes: Note[];

//   // Actions
//   addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
//   updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => void;
//   deleteNote: (id: string) => void;
//   getNotesForPage: (pageNum: number) => Note[];
//   totalCount: () => number;
// }

// const STORAGE_KEY = "notes";

// const loadNotes = (): Note[] => {
//   try {
//     const stored = localStorage.getItem(STORAGE_KEY);
//     return stored ? JSON.parse(stored) : [];
//   } catch {
//     return [];
//   }
// };

// const saveNotes = (notes: Note[]) => {
//   localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
// };

// function generateId(): string {
//   return `note_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
// }

// function persistNotes(notes: Note[]): void {
//   setStorageItem("notes", notes);
// }




// export const useNotesStore = create<NotesState>((set, get) => ({
//   notes: getStorageItem<Note[]>("notes", []),

//   addNote: (noteData) => {
//     const now = Date.now();
//     const newNote: Note = {
//       ...noteData,
//       id: generateId(),
//       createdAt: now,
//       updatedAt: now,
//     };
//     set((s) => {
//       const updated = [...s.notes, newNote];
//       persistNotes(updated);
//       return { notes: updated };
//     });
//   },

//   updateNote: (id, updates) => {
//     set((s) => {
//       const updated = s.notes.map((n) =>
//         n.id === id ? { ...n, ...updates, updatedAt: Date.now() } : n
//       );
//       persistNotes(updated);
//       return { notes: updated };
//     });
//   },

//   deleteNote: (id) => {
//     set((s) => {
//       const updated = s.notes.filter((n) => n.id !== id);
//       persistNotes(updated);
//       return { notes: updated };
//     });
//   },

//   getNotesForPage: (pageNum) => {
//     return get().notes.filter((n) => n.pageNum === pageNum);
//   },

//   totalCount: () => get().notes.length,
// }));


import { create } from "zustand";
import type { Note } from "@/types/notes.types";
import { getStorageItem, setStorageItem } from "@/utils/storage";

interface NotesState {
  notes: Note[];

  addNote: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, "id">>) => void;
  deleteNote: (id: string) => void;
  getNotesForPage: (pageNum: number) => Note[];
  totalCount: () => number;
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
}));