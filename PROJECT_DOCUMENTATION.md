# 📚 Burlington React E-Book Player — Full Developer Documentation

> **Last Updated:** March 2026  
> This document is the single source of truth for understanding the Burlington React E-Book Player codebase. Read this before touching any file.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Rationale](#2-tech-stack--rationale)
3. [How to Run the Application](#3-how-to-run-the-application)
4. [Project Structure](#4-project-structure)
5. [Application Boot Sequence](#5-application-boot-sequence)
6. [Component Architecture (with Diagram)](#6-component-architecture-with-diagram)
7. [Stores — Global State (Zustand)](#7-stores--global-state-zustand)
8. [Custom Hooks](#8-custom-hooks)
9. [Types System](#9-types-system)
10. [Config Data Layer](#10-config-data-layer)
11. [Utilities](#11-utilities)
12. [CSS Design System](#12-css-design-system)
13. [Component Deep-Dives](#13-component-deep-dives)
14. [Data Flow: How Everything Connects](#14-data-flow-how-everything-connects)
15. [LocalStorage Schema](#15-localstorage-schema)
16. [Keyboard Shortcuts Reference](#16-keyboard-shortcuts-reference)
17. [Known Bug Fixes from the Original](#17-known-bug-fixes-from-the-original)
18. [Developer Recipes (How To...)](#18-developer-recipes-how-to)
19. [What Still Needs to Be Built](#19-what-still-needs-to-be-built)

---

## 1. Project Overview

**Burlington React E-Book Player** is a modern **React + TypeScript** e-reader application built to replace a legacy HTML/jQuery-based interactive e-book. The original implementation used jQuery, SoundManager2, and scattered global JavaScript to drive an interactive 108-page grammar textbook ("Burlington English Everyday Grammar, Class 6").

### Why This Rewrite Exists

The original codebase suffered from:
- Garbled Table of Contents data (`"GGrraaddee"`, page `1100`)
- Broken `toggleMusic()` function (commented out but still called)
- jQuery version conflicts and duplicate `$(document).ready()` blocks
- Space key crash when no video was playing
- Invalid page-30 link pointing to `Page_31_1.html` instead of `Page_30_1.html`
- 28+ additional documented bugs (see [Section 17](#17-known-bug-fixes-from-the-original))

The React rewrite resolves all of these, using TypeScript for compile-time safety and Zustand for predictable global state management.

---

## 2. Tech Stack & Rationale

| Category | Technology | Version | Why |
|----------|-----------|---------|-----|
| **Framework** | React | 19.x | Declarative UI, rich ecosystem |
| **Language** | TypeScript | 5.9.x | Eliminates entire classes of runtime bugs |
| **Build Tool** | Vite | 7.x | Sub-second HMR, fast dev startup |
| **Styling** | Tailwind CSS | 4.x (via Vite plugin) | Utility-first, co-located styles, dark mode |
| **State** | Zustand | 5.x | Minimal boilerplate, no Provider needed, subscribable selectors |
| **Page Flip** | react-pageflip | 2.0.3 | HTML5 page-flip library for realistic double-page spread |
| **Animations** | Framer Motion | 12.x | Declarative animations, `AnimatePresence` for exit animations |
| **Drawing** | Fabric.js | 6.x | Canvas drawing API for pen/highlighter tools |
| **Icons** | Lucide React | 0.575.x | Modern SVG icons, tree-shakable |
| **Modals** | Radix UI | (Dialog, Tooltip, Popover) | Accessible headless components |
| **Toasts** | Sonner | 2.x | Lightweight, beautiful toast notifications |
| **Keyboard** | react-hotkeys-hook | 5.x | Declarative keyboard shortcut management |
| **Carousel** | Embla Carousel React | 8.x | Thumbnail strip carousel |
| **Color Picker** | react-colorful | 5.x | Minimal color picker for drawing tools |
| **Router** | React Router DOM | 7.x | Installed but navigation is managed internally via stores |

### Key Design Choices

- **No jQuery** anywhere — DOM manipulation is fully React-controlled
- **No Flash/SoundManager** — replaced with native HTML5 `<audio>` elements
- **Path alias `@/`** maps to `./src/` — configured in `vite.config.ts` and `tsconfig.json`
- **Tailwind CSS v4** is used via the official `@tailwindcss/vite` plugin (not PostCSS) — theming lives in `index.css`'s `@theme {}` block

---

## 3. How to Run the Application

```bash
# Install dependencies
npm install

# Start the development server (opens at http://localhost:3000)
npm run dev

# Type-check + production build (output: /dist)
npm run build

# Preview the production build locally
npm run preview
```

> **Important:** The app expects book page images to be located at `public/resources/book/page_1.webp` through `page_108.webp`. Interactive content files should be at `public/resources/interactivity/` and videos at `public/resources/animations/`. Check `src/utils/pageCalculations.ts` for exact path construction.

---

## 4. Project Structure

```
burlington-react-player/
│
├── public/
│   ├── resources/
│   │   ├── book/                    # Book page images: page_1.webp … page_108.webp
│   │   ├── interactivity/           # Activity HTML files (loaded in ActivityModal iframe)
│   │   └── animations/              # MP4 video files (loaded in VideoModal)
│   ├── audio/
│   │   └── pageflip.mp3             # Page-turn sound effect
│   └── data/
│       ├── book.config.json         # Book metadata (loaded async at startup)
│       ├── toc.json                 # Table of contents entries
│       └── pages.json               # Interactive item coordinates per page
│
├── src/
│   ├── main.tsx                     # React DOM root mount point
│   ├── App.tsx                      # Bootstrap: loads config, shows PreLoader
│   ├── index.css                    # Design system: Tailwind @theme, keyframes, utilities
│   │
│   ├── config/
│   │   ├── book.config.ts           # loadBookConfig() — fetches book.config.json
│   │   ├── toc.config.ts            # loadTocData() — fetches toc.json
│   │   └── pages.config.ts         # loadPageLinks() + getPageLinks() — page interactions
│   │
│   ├── types/
│   │   ├── book.types.ts            # BookConfig, TOCEntry, InteractiveItem, PageLinks
│   │   ├── notes.types.ts           # Note, Bookmark, Recording
│   │   └── drawing.types.ts         # DrawingTool, CanvasState, PEN_PRESETS, HIGHLIGHTER_PRESETS
│   │
│   ├── store/
│   │   ├── useBookStore.ts          # currentPage, viewMode, zoom — navigation engine
│   │   ├── useUIStore.ts            # Panel/modal visibility — UI control center
│   │   ├── useNotesStore.ts         # Notes CRUD + localStorage persistence
│   │   ├── useBookmarkStore.ts      # Bookmarks toggle + localStorage persistence
│   │   ├── useDrawingStore.ts       # Drawing tool state + per-page canvas data
│   │   └── useSettingsStore.ts      # Sound, music, theme — persisted to localStorage
│   │
│   ├── hooks/
│   │   ├── useKeyboardShortcuts.ts  # Global keyboard bindings via react-hotkeys-hook
│   │   ├── useFullscreen.ts         # Browser Fullscreen API wrapper
│   │   ├── useResponsive.ts         # Breakpoint detection via window.innerWidth
│   │   ├── usePageFlipSound.ts      # Page-flip audio player (respects useSettingsStore)
│   │   ├── useAudioRecorder.ts      # MediaRecorder API for voice annotations per page
│   │   ├── useLocalStorage.ts       # Generic typed localStorage React state sync hook
│   │   └── useClickOutside.ts       # Fires callback when click is outside a given ref
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx        # Root shell: TopBar + Sidebar + Main + Toolbar
│   │   │   ├── TopBar.tsx           # Header bar: logo, notes/bookmark counters, settings
│   │   │   ├── Sidebar.tsx          # Slide-out TOC panel
│   │   │   ├── Toolbar.tsx          # Bottom toolbar: all tool controls
│   │   │   └── PreLoader.tsx        # Animated splash screen on first load
│   │   │
│   │   ├── book/
│   │   │   └── BookViewer.tsx       # Core flipbook engine + page rendering + nav buttons
│   │   │
│   │   ├── reader/
│   │   │   ├── ThumbnailStrip.tsx   # Embla Carousel thumbnail scrubber (bottom)
│   │   │   └── PagePreviewModal.tsx # Full-resolution page zoom modal
│   │   │
│   │   ├── interactive/
│   │   │   ├── PageOverlay.tsx      # Renders icon pins + sticky notes on a page
│   │   │   ├── InteractiveIcon.tsx  # Clickable icon that triggers a modal
│   │   │   ├── ActivityModal.tsx    # iframe modal for HTML activities
│   │   │   ├── VideoModal.tsx       # HTML5 video player modal
│   │   │   └── AudioPlayer.tsx      # Inline audio player modal
│   │   │
│   │   ├── annotations/
│   │   │   ├── DrawingCanvas.tsx    # Fabric.js canvas overlay on the book
│   │   │   ├── DrawingToolbar.tsx   # Fly-out panel: pen/highlighter tools + colors
│   │   │   ├── ColorPicker.tsx      # Color preset grid + react-colorful picker
│   │   │   └── CanvasControls.tsx   # Undo / Clear / Save canvas actions
│   │   │
│   │   └── notes/
│   │       ├── NotesModal.tsx       # Add/View/Delete notes modal panel
│   │       └── StickyNote.tsx       # Draggable sticky note icon positioned on page
│   │
│   └── utils/
│       ├── constants.ts             # APP-wide constants (zoom limits, breakpoints, keys)
│       ├── storage.ts               # getStorageItem / setStorageItem — safe localStorage wrappers
│       └── pageCalculations.ts     # clampPage(), getPageImagePath()
│
├── index.html                       # Single HTML entry point
├── vite.config.ts                   # Vite config: React plugin, Tailwind, @ alias, port 3000
├── tsconfig.json                    # TypeScript config with path aliases
├── package.json                     # Dependencies and npm scripts
└── react_migration_plan.md          # Original detailed engineering plan
```

---

## 5. Application Boot Sequence

Understanding startup order is essential for debugging loading issues.

```
Browser loads index.html
        ↓
  main.tsx → ReactDOM.createRoot('#root').render(<App />)
        ↓
  App.tsx mounts → useEffect triggers bootstrap()
        ↓
  Promise.all([
    loadBookConfig(),   ← fetches /data/book.config.json
    loadTocData(),      ← fetches /data/toc.json
    loadPageLinks(),    ← fetches /data/pages.json
  ])
        ↓
  initStoragePrefix(bookConfig.id)   ← sets localStorage key namespace
  initPageAspectRatio(width, height) ← sets PAGE_ASPECT_RATIO constant
  useBookStore.initialize(totalPages) ← sets totalPages, resets to page 1
  document.title = "Subject — Class"
        ↓
  isLoading = false → PreLoader renders (animated splash)
        ↓
  AppLayout mounts (TopBar + Sidebar + BookViewer + Toolbar)
        ↓
  PreLoader fades out after animation completes (onComplete callback)
        ↓
  Book is interactive!
```

**Error Handling:** If any of the three config fetches fail, `App.tsx` renders a full-screen `<ErrorScreen>` component with the error message. No partial states.

---

## 6. Component Architecture (with Diagram)

```
App
└── PreLoader (fades out after load)
└── AppLayout
    ├── TopBar
    │   ├── Logo + Book Title
    │   ├── Bookmark count badge + dropdown
    │   ├── Notes count badge → opens NotesModal
    │   └── Settings (sound, theme toggle)
    │
    ├── Sidebar (Table of Contents, slide-in panel)
    │
    ├── main#page-wrapper
    │   └── BookViewer
    │       ├── NavButton (Previous arrow)
    │       │
    │       ├── Book Container (zoom + translateX applied here)
    │       │   │
    │       │   ├── [Double Mode] FlipBook (react-pageflip)
    │       │   │   └── PageImage × N (all 108 pages)
    │       │   │       ├── <img> (book page .webp)
    │       │   │       └── PageOverlay
    │       │   │           ├── InteractiveIcon × M  → triggers modal
    │       │   │           └── StickyNote × K        → opens NotesModal
    │       │   │
    │       │   ├── [Single Mode] AnimatePresence → motion.div
    │       │   │   └── PageImage (current page only)
    │       │   │       ├── <img>
    │       │   │       └── PageOverlay
    │       │   │
    │       │   └── DrawingCanvas (Fabric.js overlay, full book dimensions)
    │       │
    │       ├── NavButton (Next arrow)
    │       ├── BookmarkCorner (dog-ear bookmark toggle, top-right)
    │       ├── ThumbnailStrip (bottom, Embla Carousel)
    │       ├── DrawingToolbar (flyout panel, left side)
    │       │
    │       └── Modals (conditionally rendered):
    │           ├── ActivityModal  (iframe activity)
    │           ├── VideoModal     (HTML5 video)
    │           ├── AudioPlayer    (audio playback)
    │           └── PagePreviewModal (zoomed page view)
    │
    ├── Toolbar (bottom bar)
    │   ├── Page Input (go to page N)
    │   ├── Zoom In / Out / Reset
    │   ├── View Mode Toggle (Single / Double)
    │   ├── Fullscreen Toggle
    │   ├── Sidebar Toggle
    │   ├── Drawing Tool Toggle → opens DrawingToolbar
    │   ├── Thumbnail Toggle
    │   ├── Book-Only Mode Toggle
    │   └── Sound Toggle
    │
    └── NotesModal (global, rendered in AppLayout)
```

---

## 7. Stores — Global State (Zustand)

All stores live in `src/store/`. They follow a consistent pattern:
1. Define a TypeScript interface for the state shape.
2. Load any persisted values from localStorage on initialization.
3. Expose mutation functions that auto-persist to localStorage after changes.

### `useBookStore.ts` — Navigation Engine

**Purpose:** Manages the current page, view mode (single/double), zoom, and total pages.

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `currentPage` | `number` | `1` | 1-indexed current page number |
| `totalPages` | `number` | `1` | Set after boot from config |
| `viewMode` | `"single" \| "double"` | `"double"` | Page display mode |
| `zoomLevel` | `number` | `1` | 1 = no zoom, max defined by `MAX_ZOOM` constant |
| `isConfigLoaded` | `boolean` | `false` | True after `initialize()` called |

| Action | Behavior |
|--------|---------|
| `initialize(totalPages)` | Called once at boot. Sets `totalPages`, resets to page 1 |
| `setPage(page)` | Clamps to `[1, totalPages]`, saves `last_page` to localStorage |
| `nextPage()` | Steps by 2 in double mode, 1 in single mode |
| `prevPage()` | Steps back by 2 in double mode, 1 in single mode |
| `setViewMode(mode)` | Switches between `"single"` and `"double"` |
| `zoomIn/Out/resetZoom()` | Adjusts `zoomLevel` within bounds |

> **Note:** `nextPage()` and `prevPage()` are page-mode-aware — they jump by 2 in double-page spreads so the spread always stays aligned.

---

### `useUIStore.ts` — UI Control Center

**Purpose:** Controls what UI panels, modals, and modes are currently visible. No localStorage persistence (ephemeral UI state).

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `isSidebarOpen` | `boolean` | `false` | Whether the TOC sidebar is open |
| `isBookOnlyMode` | `boolean` | `false` | Hides TopBar + Toolbar for immersive reading |
| `isPreloaderVisible` | `boolean` | `true` | Controls the splash animation |
| `isThumbnailStripVisible` | `boolean` | `false` | Controls the bottom scrubber bar |
| `activeModal` | `ModalType \| null` | `null` | Which modal is currently open |

**ModalType options:** `"notes"`, `"spotlight"`, `"activity"`, `"video"`, `"print"`, `"shortcuts"`, `"thumbnail"`

> **Important:** Most modals (Activity, Video, Audio) are controlled **locally** in `BookViewer.tsx` via a `useState<ModalState>` hook, not via `useUIStore`. Only the **Notes** modal uses `useUIStore.setActiveModal("notes")`. This distinction is important to understand when debugging modal behavior.

---

### `useNotesStore.ts` — Notes CRUD

**Purpose:** CRUD for text notes attached to specific page numbers. Auto-persists to localStorage.

| State | Type | Description |
|-------|------|-------------|
| `notes` | `Note[]` | All notes, loaded from localStorage on init |

**`Note` interface** (from `src/types/notes.types.ts`):
```ts
interface Note {
  id: string;       // "note_1741234567890_abc1234"
  pageNum: number;  // Which page this note belongs to
  text: string;     // Note content
  posX: number;     // % from left for sticky note position
  posY: number;     // % from top for sticky note position
  createdAt: number; // Unix timestamp ms
  updatedAt: number; // Unix timestamp ms
}
```

| Action | Description |
|--------|-------------|
| `addNote(noteData)` | Generates ID + timestamps, appends, persists |
| `updateNote(id, updates)` | Merges partial updates, refreshes `updatedAt`, persists |
| `deleteNote(id)` | Filters out by ID, persists |
| `getNotesForPage(pageNum)` | Returns filtered array — **always requires `pageNum`** (bug fix from original) |
| `totalCount()` | Returns `notes.length` |

> **Bug Fix Note:** The original HTML app called `getNotes()` without arguments in `updateNote()`, silently returning all notes instead of page-specific ones. Here `getNotesForPage` always requires `pageNum` as enforced by TypeScript.

---

### `useBookmarkStore.ts` — Bookmark Toggle

**Purpose:** Simple set of bookmarked page numbers. Toggle on/off, persist to localStorage.

| State | Type | Default |
|-------|------|---------|
| `bookmarks` | `number[]` | Loaded from localStorage |

| Action | Description |
|--------|-------------|
| `toggleBookmark(page)` | Adds if absent, removes if present. Always sorted ascending |
| `isBookmarked(page)` | Returns `boolean` |
| `totalCount()` | Returns `bookmarks.length` |

> Bookmarks are displayed in the TopBar as a count badge and in a dropdown list clicking any entry navigates to that page.

---

### `useDrawingStore.ts` — Canvas & Drawing Tools

**Purpose:** Controls the active drawing tool, colors, sizes, and stores per-page canvas data (Fabric.js JSON strings).

| State | Type | Default | Description |
|-------|------|---------|-------------|
| `activeTool` | `DrawingTool` | `"none"` | `"none"` / `"pen"` / `"highlighter"` |
| `penColor` | `string` | `"#3b82f6"` | Hex color for pen |
| `highlightColor` | `string` | `"#60a5fa"` | Hex color for highlighter |
| `penWidth` | `number` | `2` | Stroke width in pixels |
| `isToolbarOpen` | `boolean` | `false` | Whether the drawing toolbar panel is visible |
| `canvasData` | `Record<number, string>` | From localStorage | `{pageNum: fabricJSONstring}` |

| Action | Description |
|--------|-------------|
| `setTool(tool)` | Changes active drawing tool |
| `saveCanvas(pageNum, json)` | Saves Fabric.js `canvas.toJSON()` string to localStorage |
| `clearCanvas(pageNum)` | Removes the canvas data for a specific page |
| `getHighlightedPageCount()` | Returns how many pages have canvas data |

> When `activeTool !== "none"`, `BookViewer` skips the page preview modal (clicking the page draws instead of opening a preview).

---

### `useSettingsStore.ts` — User Preferences

**Purpose:** User-controlled preferences that persist across sessions.

| Preference | Type | Default | Storage |
|-----------|------|---------|---------|
| `soundEnabled` | `boolean` | `true` | Yes |
| `musicEnabled` | `boolean` | `false` | Yes |
| `musicVolume` | `number` | `0.5` | Yes |
| `theme` | `"light" \| "dark"` | `"light"` | Yes |

**`setTheme(t)`** also directly modifies `document.documentElement.classList` (adds/removes `.dark`) to activate Tailwind dark mode.

> **Bug Fix Note:** The original code had `toggleMusic()` commented out in the JavaScript but still called from the UI, causing silent failures. This store always has a properly implemented `toggleMusic()`.

---

## 8. Custom Hooks

### `useKeyboardShortcuts.ts`
Registered in `AppLayout.tsx` via `useKeyboardShortcuts()`. Manages all global keyboard bindings using `react-hotkeys-hook`.

| Key(s) | Action |
|--------|--------|
| `→` / `ArrowRight` | Next page |
| `←` / `ArrowLeft` | Previous page |
| `Home` | Jump to page 1 |
| `End` | Jump to last page |
| `+` / `=` | Zoom in |
| `-` | Zoom out |
| `0` | Reset zoom |
| `F` | Toggle fullscreen |
| `Escape` | Close any active modal |
| `Shift + /` (`?`) | Open keyboard shortcuts cheat-sheet modal |

---

### `useFullscreen.ts`
Wraps the browser's `Fullscreen API`. Tracks state via `fullscreenchange` event listener.

```ts
const { isFullscreen, toggleFullscreen } = useFullscreen();
```

Gracefully handles browsers where fullscreen is not supported by catching the error instead of crashing.

---

### `useResponsive.ts`
Uses `window.innerWidth` with a debounced `requestAnimationFrame`-based resize listener.

Returns: `{ isMobile, isTablet, isDesktop, isLargeDesktop, width, height }`

Breakpoints (from `constants.ts`):
- `isMobile`: `width < MOBILE_BREAKPOINT` (768px)
- `isTablet`: `768 <= width < TABLET_BREAKPOINT` (1024px)  
- `isDesktop`: `1024 <= width < DESKTOP_BREAKPOINT` (1280px)
- `isLargeDesktop`: `width >= 1280px`

> **Used by:** `BookViewer.tsx` to auto-switch to single-page mode on mobile. `AppLayout.tsx` to adjust padding values. Nav buttons for responsive size.

---

### `usePageFlipSound.ts`
Creates an `HTMLAudioElement` **lazily** (only on first flip call) and plays `/audio/pageflip.mp3`. Checks `useSettingsStore.getState().soundEnabled` before playing. Resets `currentTime = 0` before each play so rapid flips sound correct.

> Uses `useSettingsStore.getState()` (imperative read) instead of subscribing reactively, to avoid unnecessary re-renders on this hook.

---

### `useAudioRecorder.ts`
Wraps the browser `MediaRecorder API`. Stores recordings as **base64-encoded strings** in localStorage, namespaced per page: `audio_{pageNum}`.

```ts
const { isRecording, recordings, startRecording, stopRecording, deleteRecording } 
  = useAudioRecorder(pageNum);
```

The recording process:
1. `startRecording()` — requests microphone access, starts `MediaRecorder`, tracks start time
2. Audio chunks accumulate in `chunksRef.current[]`
3. `stopRecording()` — stops the recorder, which triggers `onstop`
4. `onstop` converts the blob to base64 via `FileReader`, calculates duration, saves to state + localStorage

---

### `useLocalStorage.ts`
A generic typed hook for syncing a React stateful value to localStorage:

```ts
const [value, setValue] = useLocalStorage<MyType>('my-key', defaultValue);
```

Backed by `getStorageItem` / `setStorageItem` utilities.

---

### `useClickOutside.ts`
Fires a `handler` callback when a click/touch occurs **outside** a given React `ref`. Has an `enabled` parameter so it can be conditionally active.

```ts
useClickOutside(panelRef, () => setIsOpen(false), isPanelOpen);
```

---

## 9. Types System

All TypeScript interfaces live in `src/types/`. They are the shared vocabulary of the application.

### `book.types.ts`

```ts
interface BookConfig {
  subject: string;         // "Burlington English Everyday Grammar"
  class: string;           // "Class 6"
  id: string;              // UUID — used as localStorage namespace prefix
  totalPages: number;      // 108
  bookWidth: number;       // 1305 (original pixel width, used for aspect ratio)
  bookHeight: number;      // 1710 (original pixel height)
  pageExt: "webp"|"png"|"jpg";  // "webp"
}

interface TOCEntry {
  title: string;           // e.g. "Unit 1 - Articles"
  page: number;            // Page number to navigate to
  unit?: number;           // Optional unit number for grouping
  isUnitHeader?: boolean;  // If true, renders as a section header in TOC
}

interface InteractiveItem {
  x: string;               // e.g. "54.1" — percentage from left
  y: string;               // e.g. "15"   — percentage from top
  width?: string;          // Optional override for icon width
  height?: string;         // Optional override for icon height
  title: string;           // Tooltip label
  icon: string;            // Lucide icon name (e.g. "play-circle")
  link: string;            // Relative URL to the file
  type: "iframe"|"video"|"audio"; // Determines which modal to open
  size: string;            // "1024x720" — modal window size
}

type PageLinks = Record<string, InteractiveItem[]>; // { "7": [...], "12": [...] }
```

### `notes.types.ts`

```ts
interface Note { id, pageNum, text, posX, posY, createdAt, updatedAt }
interface Bookmark { pageNum, createdAt }
interface Recording { id, pageNum, data (base64), duration, createdAt }
```

### `drawing.types.ts`

```ts
type DrawingTool = "none" | "pen" | "highlighter";

// Preset color palettes
const PEN_PRESETS: DrawingPreset[] = [Black, Red, Blue, Green]
const HIGHLIGHTER_PRESETS: DrawingPreset[] = [Yellow, Green, Pink, Blue]
// (width: 2 for pen, width: 20 + opacity: 0.4 for highlighter)
```

---

## 10. Config Data Layer

The configuration files in `src/config/` act as **async data loaders** — they fetch JSON from `/public/data/` at runtime so the data can be updated without rebuilding the JavaScript bundle.

### `book.config.ts`
```ts
loadBookConfig() → Promise<BookConfig>
// Fetches: /data/book.config.json
```

### `toc.config.ts`
```ts
loadTocData() → Promise<TOCEntry[]>
// Fetches: /data/toc.json
// Data has been cleaned: fixed garbled entries ("GGrraaddee"), 
// orphaned titles (": Articles"), and invalid page 1100
```

### `pages.config.ts`
```ts
loadPageLinks() → Promise<void>                // Called once at boot, caches internally
getPageLinks()  → PageLinks                    // Used by PageOverlay to get items per page
// Fetches: /data/pages.json
// Fixed: Page 30 used to point to Page_31_1. Now points to Page_30_1.
// Format: { "7": [{ x, y, title, icon, link, type, size }], "12": [...] }
```

> `getPageLinks()` throws if called before `loadPageLinks()` has resolved. `PageOverlay.tsx` wraps the call in a `try/catch` and returns `[]` if the data isn't ready yet.

---

## 11. Utilities

### `src/utils/constants.ts`
App-wide constants. Key ones:

| Constant | Value | Usage |
|---------|-------|-------|
| `MOBILE_BREAKPOINT` | `768` | `useResponsive` |
| `TABLET_BREAKPOINT` | `1024` | `useResponsive` |
| `DESKTOP_BREAKPOINT` | `1280` | `useResponsive` |
| `MIN_ZOOM` | `0.5` | `useBookStore` |
| `MAX_ZOOM` | `3` | `useBookStore` |
| `ZOOM_STEP` | `0.25` | `useBookStore` |
| `PAGE_ASPECT_RATIO` | Initialized by `initPageAspectRatio()` | `BookViewer` dimension math |

**`initStoragePrefix(bookId)`** — Sets a module-level prefix variable so all localStorage keys are namespaced by book ID (e.g., `2caafbbe_notes`, `2caafbbe_bookmarks`). This prevents collisions if multiple books are ever run.

**`initPageAspectRatio(w, h)`** — Calculates and stores `PAGE_ASPECT_RATIO = w / h`. Used by `BookViewer` to size pages correctly.

---

### `src/utils/storage.ts`
Safe localStorage wrappers that silently fail if storage is unavailable (e.g. private browsing mode):

```ts
getStorageItem<T>(key: string, fallback: T): T
setStorageItem<T>(key: string, value: T): void
```

All reads/writes are JSON-serialized. The storage prefix from `constants.ts` is automatically prepended to every key.

---

### `src/utils/pageCalculations.ts`

```ts
clampPage(page: number, totalPages: number): number
// Ensures page is within [1, totalPages]

getPageImagePath(pageNum: number): string
// Returns e.g. "/resources/book/page_7.webp"
// Uses the pageExt from bookConfig
```

---

## 12. CSS Design System

`src/index.css` defines the entire visual language of the app using **CSS Custom Properties** inside Tailwind's `@theme {}` block. This means all tokens are available as Tailwind utilities automatically.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-brand-500` | `#3369a9` | Primary action color (buttons, links) |
| `--color-brand-50` through `brand-950` | Blue shades | Full tonal range |
| `--color-surface` | `#ffffff` | Card/panel backgrounds |
| `--color-surface-dim` | `#f8fafc` | Page background |
| `--color-on-surface` | `#0f172a` | Primary text |
| `--color-on-surface-muted` | `#64748b` | Secondary text |
| `--color-border` | `#e2e8f0` | Default border |
| `--color-success/warning/error` | Green/Amber/Red | Status colors |

### Typography
`--font-sans: "Inter", system-ui, -apple-system, sans-serif` — applied globally.

### Animation Keyframes
| Name | Usage |
|------|-------|
| `slideInLeft` | Sidebar panel enter |
| `slideInRight` | Right panels |
| `fadeIn` | Modal overlays |
| `bounceIn` | Notification badges |
| `pulseGlow` | Interactive icon attention pulse (brand color glow ring) |
| `shimmer` | Page loading skeleton animation |

### Utility Classes
| Class | Effect |
|-------|--------|
| `.glass` | Glassmorphism: `backdrop-filter: blur(12px)` + semi-transparent white |
| `.glass-dark` | Dark variant glassmorphism |
| `.skeleton` | Animated shimmer for loading states |
| `.high-contrast` | `filter: contrast(140%) brightness(110%)` for accessibility |
| `.reduce-motion *` | Disables all animations (accessibility mode) |
| `.large-text` | `font-size: 1.25rem` |

### Focus Styles
All focusable elements get `outline: 2px solid var(--color-border-focus)` via the `:focus-visible` pseudo-class — keyboard-navigable throughout the app.

### Dark Mode
Controlled by `.dark` class on `<html>`. Activated by `useSettingsStore.setTheme("dark")`, which directly toggles `document.documentElement.classList`.

---

## 13. Component Deep-Dives

### `BookViewer.tsx` — The Heart of the App

This is the most complex file (~570 lines). Here's what it manages:

**Dual Rendering Strategy:**
- **Double mode:** Uses `react-pageflip` (`<FlipBook>`) with all 108 pages rendered as children. The FlipBook library renders the realistic page-flip animation using CSS 3D transforms.
- **Single mode:** Uses Framer Motion `<AnimatePresence>` + `<motion.div>` for a smooth slide-in/slide-out transition. Only the `currentPage` is rendered — not all 108 pages.

**Why two separate implementations?**
`react-pageflip` needs all pages to exist in the DOM from the start (it manages the double-spread layout internally). Single-mode doesn't need this, and having Framer Motion handle single-page transitions produces a better UX.

**Responsive Book Sizing:**
```
ResizeObserver on container div
  → containerSize { w, h }
  → useMemo: pageDimensions = { pageWidth, pageHeight }
    Fits within available space while preserving PAGE_ASPECT_RATIO
    In double mode: available width is divided by 2 per page
  → Passed to <FlipBook width={pageWidth} height={pageHeight} />
  → Or used as inline style for single-mode container
```

**View Mode Change:**
When `viewMode` switches, `remountKey` increments, which forces `react-pageflip` to unmount + remount completely (it doesn't support dynamic resizing). The current page is preserved in `startPageRef.current` before remount.

**Store ↔ FlipBook Sync:**
Two ref flags prevent feedback loops:
- `flipbookReadyRef`: tracks if the FlipBook has initialized
- `suppressSyncRef`: when the user flips a page by dragging, the flipbook fires `onFlip`. This sets `suppressSyncRef = true` so the subsequent `useEffect` that syncs `currentPage → flipbook` is skipped for that cycle.

---

### `PageOverlay.tsx` — The Interaction Layer

Sits as an `absolute inset-0` div on top of each page image. Renders two types of children:
1. **`InteractiveIcon`** — for each `InteractiveItem` in `getPageLinks()[pageNum]`
2. **`StickyNote`** — for each note in `useNotesStore` that belongs to this `pageNum`

Uses `useMemo` to filter both the links and notes so they only recalculate when the data actually changes, not on every render.

The overlay itself has `pointer-events-none` so it doesn't block clicks on the page. Individual icons and notes override this with `pointer-events-auto`.

---

### `DrawingCanvas.tsx` — Fabric.js Integration

Creates a Fabric.js canvas that overlays the entire book container. Key behaviors:
- Canvas is **invisible** when `activeTool === "none"` (mouse events pass through)
- When a tool is activated, `canvas.isDrawingMode = true` and pointer events are captured
- On every `canvas:path:added` event, the canvas JSON is saved via `useDrawingStore.saveCanvas()`
- On page change, the canvas is cleared and reloaded from `canvasData[newPage]`

**Pen vs Highlighter:**
The highlighter uses a wider stroke width (20px) and sets `globalCompositeOperation = "multiply"` to create a semi-transparent highlight effect over the text.

---

## 14. Data Flow: How Everything Connects

### Scenario: User Clicks "Next Page"

```
User clicks NextPage button in BookViewer
  → handleNext() → prevPage() from useBookStore
  → useBookStore.nextPage() calculates next page number
  → calls setPage(next) → stores to localStorage ("last_page")
  → currentPage state updates in Zustand store
  → BookViewer re-renders (subscribed to currentPage)
  → In double mode: useEffect fires, calls pf.flip(targetIndex) on FlipBook
  → FlipBook animates, fires onFlip event → onPage() called
  → suppressSyncRef = true (prevents double-sync loop)
  → In single mode: AnimatePresence detects key change, exits old + enters new page
  → onFlipEvent → playFlip() → plays pageflip.mp3 if soundEnabled
  → PageOverlay on new page renders its InteractiveItems
  → DrawingCanvas loads saved canvas data for new page
```

### Scenario: User Adds a Note

```
User clicks "Add Note" in toolbar (or StickyNote icon on page)
  → useUIStore.setActiveModal("notes")
  → NotesModal becomes visible (reads activeModal from useUIStore)
  → User types text + submits
  → useNotesStore.addNote({ pageNum, text, posX, posY })
  → Note gets ID + timestamps, appended to notes[]
  → notes[] persisted to localStorage
  → PageOverlay (which subscribes to notes via useMemo filter) re-renders
  → StickyNote component appears on the page at posX/posY
```

### Scenario: User Draws on a Page

```
User clicks the Pen tool button in Toolbar
  → useDrawingStore.setTool("pen")
  → DrawingCanvas detects activeTool !== "none"
  → canvas.isDrawingMode = true
  → pointer-events on canvas enabled (blocks clicks through to page)
  → User draws strokes on canvas
  → canvas:path:added fires → saveCanvas(pageNum, canvas.toJSON())
  → canvasData[pageNum] saved to localStorage
  → getHighlightedPageCount() returns updated count (shown in TopBar badge)
```

---

## 15. LocalStorage Schema

All keys are prefixed with the book's UUID. Example prefix: `2caafbbe-41ae-411d-a4fe-35942aca42d9`.

| Key | Type | Set By | Content |
|-----|------|--------|---------|
| `{prefix}_bookmarks` | `number[]` | `useBookmarkStore` | `[7, 14, 23]` |
| `{prefix}_notes` | `Note[]` | `useNotesStore` | Array of note objects |
| `{prefix}_canvas_data` | `Record<number, string>` | `useDrawingStore` | `{7: "{"objects":[...]}", 14: "..."}` |
| `{prefix}_audio_{pageNum}` | `Recording[]` | `useAudioRecorder` | Per-page voice recordings (base64) |
| `{prefix}_settings` | Partial settings | `useSettingsStore` | `{soundEnabled, musicEnabled, theme, ...}` |
| `{prefix}_last_page` | `number` | `useBookStore.setPage()` | Last visited page number |

---

## 16. Keyboard Shortcuts Reference

| Key | Action | Where Handled |
|-----|--------|--------------|
| `→` / `ArrowRight` | Next page | `useKeyboardShortcuts` + `BookViewer` (dual registration) |
| `←` / `ArrowLeft` | Previous page | Same |
| `Home` | First page (1) | `useKeyboardShortcuts` |
| `End` | Last page | `useKeyboardShortcuts` |
| `+` / `=` | Zoom in | `useKeyboardShortcuts` |
| `-` | Zoom out | `useKeyboardShortcuts` |
| `0` | Reset zoom | `useKeyboardShortcuts` |
| `F` | Toggle fullscreen | `useKeyboardShortcuts` |
| `Escape` | Close any modal | `useKeyboardShortcuts` |
| `Shift + ?` | Open shortcuts help | `useKeyboardShortcuts` |

> **Note on Arrow Key Redundancy:** Arrow key handling exists in both `useKeyboardShortcuts` (via `react-hotkeys-hook`) and in `BookViewer.tsx` (via `window.addEventListener("keydown")`). This ensured reliable behavior while working around event-capture issues with the FlipBook library.

---

## 17. Known Bug Fixes from the Original

Every documented bug from the original HTML/jQuery app has been addressed:

| # | Original Bug | Fix in React Version |
|---|-------------|---------------------|
| 1 | `<li>` inside `<button>` | Semantic HTML via Radix UI DropdownMenu |
| 2 | Malformed SVG `stroke-width` attribute | All icons via Lucide React |
| 3 | Duplicate `$(document).ready()` blocks | Single `useEffect` per component |
| 4 | Invalid jQuery selector with special chars | TypeScript string safety, no jQuery |
| 5 | Duplicate `const` declarations in same scope | ES modules give each file its own scope |
| 6 | Space bar crashes when no video loaded | `react-hotkeys-hook` with guard checks |
| 7 | `toggleMusic()` commented out but called | Properly implemented in `useSettingsStore` |
| 8 | Garbled TOC: `"GGrraaddee"`, page `1100` | Cleaned data in `toc.json` |
| 9 | `getNotes()` called without `pageNum` argument | TypeScript enforces required param |
| 10 | Page 30 links to `Page_31_1` | Fixed in `pages.json` |
| 11 | Duplicate `getBrowser()` function | Not needed — React handles cross-browser |
| 12 | `$(this).remove()` in `selectTool()` | React state management replaces DOM manipulation |
| 13 | `toggleMusic` called in `showAudioPanel` | Always exists in `useSettingsStore` |
| 14 | jQuery version conflict potential | No jQuery at all |
| 15 | `<script>` tags after `</body>` | Single `main.tsx` entry point |
| 16 | No type-check on `postMessage` data | TypeScript + type-safe message handlers |
| 17 | `#quizModal` not in DOM | `ActivityModal` conditionally mounted |
| 18–28 | Typos, dead code, `style` attribute accumulation | TypeScript, Tailwind classes, no inline style mutation |

---

## 18. Developer Recipes (How To...)

### 🔧 Add a New Interactive Activity to a Page

1. Open `public/data/pages.json`
2. Find the key for your page number (e.g. `"45"`)
3. Add an entry to the array:
```json
{
  "x": "72.5",
  "y": "30",
  "title": "Grammar Exercise",
  "icon": "puzzle",
  "link": "resources/interactivity/Page_45_2.html",
  "type": "iframe",
  "size": "1024x720"
}
```
4. X/Y are percentage positions from the top-left of the page image.
5. No code change needed — `PageOverlay` reads this dynamically.

---

### 🔧 Add a New Book-Wide Feature (New Toggle)

1. Add the state key in `useUIStore.ts`:
```ts
isSpotlightOn: boolean;
toggleSpotlight: () => void;
```
2. Initialize it in the `create()` call:
```ts
isSpotlightOn: false,
toggleSpotlight: () => set(s => ({ isSpotlightOn: !s.isSpotlightOn })),
```
3. Add a button to `Toolbar.tsx` connected to `useUIStore(s => s.toggleSpotlight)`.
4. Render your feature panel/overlay inside `AppLayout.tsx` conditional on `isSpotlightOn`.
5. Wrap it in `<AnimatePresence>` + `<motion.div>` for smooth transitions.

---

### 🔧 Add a New Note Field

1. Update `Note` interface in `src/types/notes.types.ts`
2. Update `addNote` in `useNotesStore.ts` to handle the new field
3. Update `NotesModal.tsx` to include the new field in the form
4. Update `StickyNote.tsx` if the field should affect visual appearance
5. **Migration concern:** Existing notes in localStorage won't have the new field. Use optional chaining `note.newField?.` and provide defaults in `getStorageItem`.

---

### 🐛 Debugging: "Why is this component re-rendering too much?"

**Wrong — subscribes to entire store, re-renders on any store change:**
```ts
const bookStore = useBookStore();
const { currentPage } = bookStore;
```

**Correct — subscribes only to `currentPage`:**
```ts
const currentPage = useBookStore(s => s.currentPage);
```

Use React DevTools → Profiler to confirm. Most unnecessary re-renders in this codebase come from over-broad Zustand subscriptions.

---

### 🐛 Debugging: FlipBook Not Showing the Right Page

The FlipBook requires careful sync between the React store and the underlying library. Check:
1. Is `flipbookReadyRef.current` true? If not, the FlipBook hasn't initialized yet.
2. Is `suppressSyncRef.current` stuck at `true`? It should reset to `false` each cycle.
3. Has `viewMode` changed recently? This remounts the FlipBook and resets sync state.
4. Try adding a `console.log` in the `useEffect` that syncs `currentPage → flipbook` to trace the values.

---

### 🔧 Changing the Page Image Path Format

Open `src/utils/pageCalculations.ts` and modify `getPageImagePath()`:
```ts
export function getPageImagePath(pageNum: number): string {
  return `/resources/book/page_${pageNum}.webp`;
  //                             ^ change this format
}
```
The `pageExt` from `bookConfig` is available via `constants.ts` if you want format to be dynamic.

---

## 19. What Still Needs to Be Built

Based on the original `react_migration_plan.md`, these features are planned but not yet implemented:

| Feature | Phase | Status |
|---------|-------|--------|
| Dark mode toggle in UI | Phase 7.1 | `useSettingsStore` ready, UI toggle TBD |
| Full-text TOC search | Phase 7.2 | Not started |
| Reading progress bar | Phase 7.5 | Not started |
| Auto-resume last page toast | Phase 7.6 | Not started |
| Export notes to file | Phase 7.7 | Not started |
| Theme color customization | Phase 7.8 | Not started |
| Accessibility panel | Phase 7.9 | Partially (CSS classes ready: `.high-contrast`, `.large-text`, `.reduce-motion`) |
| Audio recorder UI | Phase 5/7 | Hook built (`useAudioRecorder`), no UI component yet |
| Background music player | Phase 7 | Store ready (`musicEnabled`, `musicVolume`), no UI component |
| Spotlight overlay tool | Phase 2 | UI slot exists in Toolbar, not implemented |
| Print dialog | Phase 7 | Toolbar slot exists, not implemented |
| Keyboard shortcuts help modal | Phase 7.4 | `activeModal: "shortcuts"` handled, modal component needed |
| Unit tests (Vitest) | Phase 9 | Not started |

> The `AccessibilityPanel` component is imported but commented out in `App.tsx` — it exists in `src/accessibility/` and is in progress.

---

*This documentation was written based on the full codebase as of March 2026. For the engineering plan and rationale, see `react_migration_plan.md`.*
