// ============================================
// ColorPicker — Preset colors + custom color picker
// ============================================
// Shows a row of preset color swatches.
// Clicking "Custom" opens react-colorful for any color.
// Used by DrawingToolbar for pen and highlighter colors.
// ============================================

import { useState } from "react";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  presets: string[];
  label?: string;
}

export default function ColorPicker({
  color,
  onChange,
  presets,
  label,
}: ColorPickerProps) {
  const [showCustom, setShowCustom] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
      )}

      {/* Preset swatches */}
      <div className="flex flex-wrap gap-1.5">
        {presets.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              onChange(preset);
              setShowCustom(false);
            }}
            className={`h-7 w-7 rounded-full border-2 transition-all hover:scale-110 active:scale-95 ${
              color === preset
                ? "border-gray-800 ring-2 ring-brand-400 ring-offset-1 scale-110"
                : "border-gray-300 hover:border-gray-500"
            }`}
            style={{ backgroundColor: preset }}
            title={preset}
          />
        ))}

        {/* Custom color toggle */}
        <button
          onClick={() => setShowCustom(!showCustom)}
          className={`h-7 w-7 rounded-full border-2 border-dashed transition-all hover:scale-110 flex items-center justify-center text-xs ${
            showCustom
              ? "border-brand-500 bg-brand-50 text-brand-600"
              : "border-gray-400 text-gray-500 hover:border-gray-600"
          }`}
          title="Custom color"
        >
          +
        </button>
      </div>

      {/* Custom color picker (react-colorful) */}
      {showCustom && (
        <div className="pt-2">
          <HexColorPicker
            color={color}
            onChange={onChange}
            style={{ width: "100%", height: 120 }}
          />
          <div className="mt-1.5 flex items-center gap-2">
            <div
              className="h-6 w-6 rounded border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs font-mono text-gray-600">{color}</span>
          </div>
        </div>
      )}
    </div>
  );
}
