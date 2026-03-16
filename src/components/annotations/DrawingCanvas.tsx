// ============================================
// DrawingCanvas — Fabric.js drawing overlay for the book
// ============================================
// Single transparent canvas overlay that sits ON TOP of the book container
// (outside react-pageflip's DOM so it gets full pointer events).
// Per-page state persisted to localStorage via useDrawingStore.
//
// In DOUBLE mode the canvas covers two pages side-by-side.
// Drawings on the left half are stored under `currentPage` and drawings
// on the right half are stored under `currentPage + 1`.  When saving we
// split the objects by their centre-X relative to the canvas midpoint.
// ============================================

import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useBookStore } from "@/store/useBookStore";

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<FabricCanvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    activeTool,
    penColor,
    highlightColor,
    penWidth,
    canvasData,
    saveCanvas,
  } = useDrawingStore();

  const currentPage = useBookStore((s) => s.currentPage);
  const viewMode = useBookStore((s) => s.viewMode);
  const totalPages = useBookStore((s) => s.totalPages);
  const isActive = activeTool !== "none";

  // In double mode the right page is currentPage + 1 (if it exists)
  const leftPage = currentPage;
  const rightPage =
    viewMode === "double" && currentPage + 1 <= totalPages
      ? currentPage + 1
      : null;

  // ── Helpers to split / merge per-page JSON ────────────────────────
  /**
   * Merge two per-page Fabric JSON blobs into a single canvas-worth of
   * objects.  Left-page objects stay as-is; right-page objects are offset
   * to the right half of the canvas.
   */
  const mergeCanvasData = useCallback(
    (leftJson: string | undefined, rightJson: string | undefined, canvasWidth: number) => {
      const leftObjects = parseObjects(leftJson);
      const rightObjects = parseObjects(rightJson);

      // Offset right-page objects by half the canvas width
      const halfW = canvasWidth / 2;
      const shifted = rightObjects.map((obj: any) => ({
        ...obj,
        left: (obj.left ?? 0) + halfW,
      }));

      return [...leftObjects, ...shifted];
    },
    [],
  );

  /**
   * Split canvas objects into left-page and right-page buckets and
   * persist each independently.
   */
  const splitAndSave = useCallback(
    (fc: FabricCanvas) => {
      if (viewMode !== "double" || !rightPage) {
        // Single mode — save everything under currentPage
        const json = JSON.stringify(fc.toJSON());
        saveCanvas(currentPage, json);
        return;
      }

      const halfW = fc.getWidth() / 2;
      const allObjects = fc.getObjects();

      const leftObjs: any[] = [];
      const rightObjs: any[] = [];

      allObjects.forEach((obj: any) => {
        const raw = obj.toJSON();
        // Use the object's bounding-rect centre to decide which page it
        // belongs to.
        const bound = obj.getBoundingRect();
        const centreX = bound.left + bound.width / 2;

        if (centreX < halfW) {
          leftObjs.push(raw);
        } else {
          // Shift back so coordinates are page-local (0-based)
          rightObjs.push({ ...raw, left: (raw.left ?? 0) - halfW });
        }
      });

      const baseJson = fc.toJSON();
      const leftJson = JSON.stringify({ ...baseJson, objects: leftObjs });
      const rightJson = JSON.stringify({ ...baseJson, objects: rightObjs });

      saveCanvas(leftPage, leftJson);
      saveCanvas(rightPage, rightJson);
    },
    [viewMode, rightPage, leftPage, currentPage, saveCanvas],
  );

  // ── Initialize / re-initialize Fabric canvas when page changes ─────
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const el = canvasRef.current;
    const parent = containerRef.current;
    const w = parent.offsetWidth;
    const h = parent.offsetHeight;

    if (w === 0 || h === 0) return;

    el.width = w;
    el.height = h;

    const fc = new FabricCanvas(el, {
      isDrawingMode: false,
      width: w,
      height: h,
      backgroundColor: "transparent",
      selection: false,
    });

    fabricRef.current = fc;

    // Load saved data
    const loadCanvas = async () => {
      try {
        if (viewMode === "double" && rightPage) {
          // Merge left + right page data
          const leftData = canvasData[leftPage];
          const rightData = canvasData[rightPage];

          if (leftData || rightData) {
            const mergedObjects = mergeCanvasData(leftData, rightData, w);
            const baseJson = leftData
              ? JSON.parse(leftData)
              : rightData
                ? JSON.parse(rightData)
                : { version: "6.6.1", objects: [] };

            const mergedJson = JSON.stringify({
              ...baseJson,
              objects: mergedObjects,
            });

            await fc.loadFromJSON(mergedJson);
          }
        } else {
          // Single mode
          const savedJson = canvasData[currentPage];
          if (savedJson) {
            await fc.loadFromJSON(savedJson);
          }
        }
      } catch {
        // If JSON is corrupted, just clear
      }

      fc.backgroundColor = "transparent";
      fc.renderAll();
    };

    loadCanvas();

    // Immediately apply drawing mode if tool is active
    if (activeTool !== "none") {
      fc.isDrawingMode = true;
      const brush = new PencilBrush(fc);

      if (activeTool === "pen") {
        brush.color = penColor;
        brush.width = penWidth;
      } else if (activeTool === "highlighter") {
        const hex = highlightColor;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        brush.color = `rgba(${r}, ${g}, ${b}, 0.4)`;
        brush.width = 20;
      }

      fc.freeDrawingBrush = brush;
    }

    return () => {
      fc.dispose();
      fabricRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, viewMode]);

  // ── Update drawing mode when tool changes ──────────────────────────
  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    if (activeTool === "none") {
      fc.isDrawingMode = false;
      return;
    }

    fc.isDrawingMode = true;
    const brush = new PencilBrush(fc);

    if (activeTool === "pen") {
      brush.color = penColor;
      brush.width = penWidth;
    } else if (activeTool === "highlighter") {
      // Use an rgba color for semi-transparent highlighter strokes
      const hex = highlightColor;
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      brush.color = `rgba(${r}, ${g}, ${b}, 0.4)`;
      brush.width = 20;
    }

    fc.freeDrawingBrush = brush;
  }, [activeTool, penColor, highlightColor, penWidth]);

  // ── Auto-save on every path created ────────────────────────────────
  const handlePathCreated = useCallback(() => {
    const fc = fabricRef.current;
    if (!fc) return;
    splitAndSave(fc);
  }, [splitAndSave]);

  useEffect(() => {
    const fc = fabricRef.current;
    if (!fc) return;

    fc.on("path:created", handlePathCreated);
    return () => {
      fc.off("path:created", handlePathCreated);
    };
  }, [handlePathCreated]);

  // ── Resize canvas when container resizes ───────────────────────────
  useEffect(() => {
    const fc = fabricRef.current;
    const container = containerRef.current;
    if (!fc || !container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height;
        fc.setDimensions({ width: w, height: h });
        fc.renderAll();
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [currentPage]);

  // Expose fabricRef so DrawingToolbar can access it
  useEffect(() => {
    (window as any).__fabricCanvas = fabricRef.current;
    return () => {
      (window as any).__fabricCanvas = null;
    };
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 z-20"
      style={{
        pointerEvents: isActive ? "auto" : "none",
        cursor: isActive ? "crosshair" : "default",
        touchAction: "none",
      }}
    >
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

// ── Utility ──────────────────────────────────────────────────────────
function parseObjects(json: string | undefined): any[] {
  if (!json) return [];
  try {
    const parsed = JSON.parse(json);
    return Array.isArray(parsed.objects) ? parsed.objects : [];
  } catch {
    return [];
  }
}
