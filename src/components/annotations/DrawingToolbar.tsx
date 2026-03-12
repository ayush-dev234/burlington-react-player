// ============================================
// DrawingToolbar — Sliding side panel with drawing tools
// ============================================
// Opens from the left when pen or highlighter is activated.
// Vertical layout matching the reference design (square boxes).
// Light theme with clean, modern UI.
// ============================================

import { motion, AnimatePresence } from "framer-motion";
import { X, Pen, Highlighter, Undo2, Trash2, ChevronDown } from "lucide-react";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useDrawingStore } from "@/store/useDrawingStore";
import { useBookStore } from "@/store/useBookStore";
import { useResponsive } from "@/hooks/useResponsive";
import { PEN_PRESETS, HIGHLIGHTER_PRESETS } from "@/types/drawing.types";
import { Canvas as FabricCanvas } from "fabric";

const PEN_COLORS = PEN_PRESETS.map((p) => p.color);
const HIGHLIGHT_COLORS = HIGHLIGHTER_PRESETS.map((p) => p.color);

export default function DrawingToolbar() {
  const {
    activeTool,
    setTool,
    penColor,
    setPenColor,
    highlightColor,
    setHighlightColor,
    isToolbarOpen,
    toggleToolbar,
    saveCanvas,
    clearCanvas,
    canvasData,
  } = useDrawingStore();

  const { currentPage, setPage } = useBookStore();
  const { isMobile } = useResponsive();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  const isOpen = isToolbarOpen && activeTool !== "none";

  // Current active color
  const activeColor = activeTool === "pen" ? penColor : highlightColor;
  const setActiveColor =
    activeTool === "pen" ? setPenColor : setHighlightColor;

  // Use the presets based on tool, or a generic set if undefined
  const colorPresets = activeTool === "pen" ? PEN_COLORS : HIGHLIGHT_COLORS;

  // Pages that have annotations
  const annotatedPages = useMemo(() => {
    return Object.keys(canvasData)
      .map(Number)
      .filter((p) => {
        const data = canvasData[p];
        if (!data) return false;
        try {
          const parsed = JSON.parse(data);
          return parsed.objects && parsed.objects.length > 0;
        } catch {
          return false;
        }
      })
      .sort((a, b) => a - b);
  }, [canvasData]);

  // ── Get the Fabric canvas instance ────────────────────────────────
  const getFabricCanvas = useCallback((): FabricCanvas | null => {
    return (window as any).__fabricCanvas ?? null;
  }, []);

  // ── Undo handler ──────────────────────────────────────────────────
  const handleUndo = useCallback(() => {
    const fc = getFabricCanvas();
    if (!fc) return;

    const objects = fc.getObjects();
    if (objects.length === 0) return;

    const lastObj = objects[objects.length - 1];
    if (!lastObj) return;
    fc.remove(lastObj);
    fc.renderAll();

    // Save updated state
    const json = JSON.stringify(fc.toJSON());
    saveCanvas(currentPage, json);
  }, [getFabricCanvas, currentPage, saveCanvas]);

  // ── Clear handler ─────────────────────────────────────────────────
  const handleClear = useCallback(() => {
    const fc = getFabricCanvas();
    if (!fc) return;

    fc.clear();
    fc.backgroundColor = "transparent";
    fc.renderAll();
    clearCanvas(currentPage);
    setShowConfirm(false);
  }, [getFabricCanvas, currentPage, clearCanvas]);

  // ── Page selection handler ────────────────────────────────────────
  const handlePageChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const page = parseInt(e.target.value, 10);
      if (!isNaN(page)) {
        setPage(page);
      }
    },
    [setPage],
  );

  // Close color picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        colorPickerRef.current &&
        !colorPickerRef.current.contains(e.target as Node)
      ) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showColorPicker]);

  // Common button styles based on the user's square UI requirement
  const baseBtnClass =
    "flex items-center gap-3 w-full rounded-sm px-4 py-3 text-[15px] font-semibold transition-all border outline-none";
  const inactiveBtnClass =
    "bg-linear-to-b from-white to-gray-50 border-gray-300 text-gray-700 hover:from-gray-50 hover:to-gray-100 hover:border-gray-400 shadow-[0_1px_2px_rgba(0,0,0,0.05)]";
  const activeBtnClass =
    "bg-linear-to-b from-blue-500 to-blue-600 border-blue-700 text-white shadow-[inset_0_1px_4px_rgba(0,0,0,0.2)]";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={isMobile ? { y: 300, opacity: 0 } : { x: -280, opacity: 0 }}
          animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
          exit={isMobile ? { y: 300, opacity: 0 } : { x: -280, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 300 }}
          className={`fixed z-55 ${
            isMobile
              ? "bottom-14 left-2 right-2 w-auto"
              : "top-[70px] left-4 w-[260px]"
          }`}
          style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
        >
          {/* Main Toolbar Container - Light theme, slight shadow, squarish corners */}
          <div className="rounded border border-gray-300 bg-[#f8f9fa] shadow-2xl overflow-visible">
            
            {/* ── Header ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200">
              <h3 className="text-[17px] font-bold text-gray-800 tracking-tight">
                Tools
              </h3>
              <button
                onClick={() => {
                  setTool("none");
                  toggleToolbar();
                }}
                className="flex h-7 w-7 items-center justify-center rounded-sm text-gray-500 transition-all hover:bg-gray-200 hover:text-gray-900"
                title="Close"
              >
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            {/* ── Content ────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 p-4">
              
              {/* ── Pen Button ── */}
              <button
                onClick={() => setTool("pen")}
                className={`${baseBtnClass} ${
                  activeTool === "pen" ? activeBtnClass : inactiveBtnClass
                }`}
              >
                <Pen size={18} strokeWidth={2.5} />
                Pen
              </button>

              {/* ── Highlight Button ── */}
              <button
                onClick={() => setTool("highlighter")}
                className={`${baseBtnClass} ${
                  activeTool === "highlighter" ? activeBtnClass : inactiveBtnClass
                }`}
              >
                <Highlighter size={18} strokeWidth={2.5} />
                Highlight
              </button>

              {/* ── Undo Button ── */}
              <button
                onClick={handleUndo}
                className={`${baseBtnClass} ${inactiveBtnClass}`}
                title="Undo last drawing"
              >
                <Undo2 size={18} strokeWidth={2.5} />
                Undo
              </button>

              {/* ── Clear Button ── */}
              {!showConfirm ? (
                <button
                  onClick={() => setShowConfirm(true)}
                  className={`${baseBtnClass} ${inactiveBtnClass} hover:from-red-50! hover:to-red-100! hover:border-red-300! hover:text-red-700!`}
                  title="Clear all drawings"
                >
                  <Trash2 size={18} strokeWidth={2.5} />
                  Clear
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleClear}
                    className="flex-1 rounded-sm bg-linear-to-b from-red-500 to-red-600 border border-red-700 px-3 py-3 text-[14px] font-bold text-white shadow-sm hover:from-red-600 hover:to-red-700"
                  >
                    Yes, Clear
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 rounded-sm bg-linear-to-b from-white to-gray-100 border border-gray-300 px-3 py-3 text-[14px] font-bold text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* ── Color Picker Dropdown ── */}
              <div className="relative mt-1" ref={colorPickerRef}>
                <button
                  onClick={() => setShowColorPicker(!showColorPicker)}
                  className={`flex w-full items-center justify-between rounded-sm border border-gray-300 bg-linear-to-b from-white to-gray-50 px-3 py-2 transition-all hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)]`}
                  title="Select Color"
                >
                  <div
                    className="h-8 w-full rounded-sm border border-gray-300 shadow-inner mr-2 relative overflow-hidden"
                    style={{
                      backgroundColor: activeColor,
                    }}
                  >
                    {/* Semi-transparent pattern overlay for highlighter to indicate opacity */}
                    {activeTool === "highlighter" && (
                      <div className="absolute inset-0 bg-white/40" />
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${showColorPicker ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 right-0 top-full mt-2 z-50 rounded-sm border border-gray-300 bg-white shadow-[0_10px_25px_rgba(0,0,0,0.1)] p-4"
                    >
                      <span className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-2.5 block">
                        {activeTool === "pen" ? "Pen Color" : "Highlight Color"}
                      </span>

                      {/* Preset swatches */}
                      <div className="flex flex-wrap gap-2.5 mb-4">
                        {colorPresets.map((color) => {
                          const isSelected = color === activeColor;
                          return (
                            <button
                              key={color}
                              onClick={() => {
                                setActiveColor(color);
                                setShowColorPicker(false);
                              }}
                              className={`h-8 w-8 rounded-sm transition-all hover:scale-110 active:scale-95 shadow-sm border ${
                                isSelected
                                  ? "border-blue-600 ring-2 ring-blue-300 ring-offset-1 scale-110 z-10"
                                  : "border-gray-200"
                              }`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          );
                        })}
                      </div>

                      {/* Custom color input */}
                      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                        <label className="text-sm font-semibold text-gray-600">
                          Custom
                        </label>
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-sm p-1 shadow-inner">
                          <input
                            type="color"
                            value={activeColor}
                            onChange={(e) => setActiveColor(e.target.value)}
                            className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0 shrink-0"
                            title="Pick custom color"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* ── Page Selection (annotated pages only) ── */}
              <div className="space-y-1.5 mt-2">
                <span className="text-[13px] font-bold text-gray-700 tracking-wide px-1 block">
                  Page Selection
                </span>
                <div className="relative">
                  <select
                    value={
                      annotatedPages.includes(currentPage) ? currentPage : ""
                    }
                    onChange={handlePageChange}
                    className="w-full rounded-sm border border-gray-300 bg-linear-to-b from-white to-gray-50 px-3 py-3 text-[14px] font-semibold text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-gray-400 appearance-none shadow-[0_1px_2px_rgba(0,0,0,0.05)] cursor-pointer"
                  >
                    {annotatedPages.length === 0 ? (
                      <option value="" disabled>
                        No annotations yet
                      </option>
                    ) : (
                      annotatedPages.map((pageNum) => (
                        <option key={pageNum} value={pageNum}>
                          Page {pageNum}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>
              
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
