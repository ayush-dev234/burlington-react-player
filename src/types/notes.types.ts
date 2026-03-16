// ============================================
// Notes Types — Note and bookmark domain types
// ============================================

export interface Note {
  id: string;
  pageNum: number;
  text: string;
  posX: number;
  posY: number;
  createdAt: number;
  updatedAt: number;
}

export interface Bookmark {
  pageNum: number;
  createdAt: number;
}

export interface Recording {
  id: string;
  pageNum: number;
  data: string;       // base64 encoded audio
  duration: number;    // seconds
  createdAt: number;
}
