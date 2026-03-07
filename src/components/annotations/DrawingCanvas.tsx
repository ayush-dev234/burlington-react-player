// ============================================
// DrawingCanvas — Fabric.js drawing overlay for the book
// ============================================
// Single transparent canvas overlay that sits ON TOP of the book container
// (outside react-pageflip's DOM so it gets full pointer events).
// Per-page state persisted to localStorage via useDrawingStore.
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
  const isActive = activeTool !== "none";

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

    // Load saved data for the current page
    const savedJson = canvasData[currentPage];
    if (savedJson) {
      try {
        fc.loadFromJSON(savedJson).then(() => {
          fc.backgroundColor = "transparent";
          fc.renderAll();
        });
      } catch {
        // If JSON is corrupted, just clear
      }
    }

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
  }, [currentPage]);

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

    const json = JSON.stringify(fc.toJSON());
    saveCanvas(currentPage, json);
  }, [currentPage, saveCanvas]);

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
