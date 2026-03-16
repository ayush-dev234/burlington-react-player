// ============================================
// CanvasControls — Undo, Clear, and Save indicator
// ============================================
// Provides undo (last drawn object) and clear (all on page).
// Shows a confirmation dialog before clearing.
// ============================================

import { useState} from "react";
import { Undo2, Trash2 } from "lucide-react";
import { Canvas as FabricCanvas } from "fabric";

interface CanvasControlsProps {
  fabricCanvas: FabricCanvas | null;
  pageNum: number;
  onClear: (pageNum: number) => void;
  onSave: (pageNum: number, json: string) => void;
}



export default function CanvasControls({
  fabricCanvas,
  pageNum,
  onClear,
  onSave,
}: CanvasControlsProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const handleUndo = () => {
    if (!fabricCanvas) return;

    const objects = fabricCanvas.getObjects();
    if (objects.length === 0) return;

    const lastObj = objects[objects.length - 1];
    if (!lastObj) return;
    fabricCanvas.remove(lastObj);
    fabricCanvas.renderAll();

    // Save updated state
    const json = JSON.stringify(fabricCanvas.toJSON());
    onSave(pageNum, json);
  };

  const handleClear = () => {
    if (!fabricCanvas) return;

    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "transparent";
    fabricCanvas.renderAll();
    onClear(pageNum);
    setShowConfirm(false);
  };

  const objectCount = fabricCanvas?.getObjects().length ?? 0;
  

  return (
    <div className="space-y-2">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Actions
      </span>

      <div className="flex gap-2">
        {/* Undo button */}
        <button
          onClick={handleUndo}
          disabled={objectCount === 0}
          className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
          title="Undo last drawing"
        >
          <Undo2 size={15} />
          Undo
        </button>

        {/* Clear button */}
        {!showConfirm ? (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={objectCount === 0}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300 active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            title="Clear all drawings on this page"
          >
            <Trash2 size={15} />
            Clear
          </button>
        ) : (
          <div className="flex-1 flex gap-1">
            <button
              onClick={handleClear}
              className="flex-1 rounded-lg bg-red-500 px-2 py-2 text-xs font-semibold text-white transition-all hover:bg-red-600 active:scale-95"
            >
              Yes
            </button>
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 rounded-lg border border-gray-300 bg-gray-50 px-2 py-2 text-xs font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95"
            >
              No
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
