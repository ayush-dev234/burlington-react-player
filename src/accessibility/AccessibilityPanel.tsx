import React, { useState } from "react";
import { X } from "lucide-react";
import {
    toggleContrast,
    increaseText,
    changeSpacing,
    toggleAnimations,
    toggleRead,
    resetAccessibility
} from "@/utils/accessibility.utils"
interface ItemProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ label, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center p-3 border border-gray-200 hover:bg-blue-50 transition"
    >
      <div className="text-xl">{icon}</div>
      <span className="text-xs mt-1 text-center">{label}</span>
    </button>
  );
};

const AccessibilityPanel: React.FC = () => {
  const [open, setOpen] = useState<boolean>(true);

  if (!open) return null;

  return (
    <div className="fixed left-4 bottom-16 w-[210px] bg-white shadow-xl border rounded overflow-hidden z-50">

      {/* Header */}
      <div className="flex items-center justify-between bg-[#1c3f57] text-white px-3 py-2">
        <span className="text-sm font-semibold">Accessibility</span>
        <button onClick={() => setOpen(false)}>
          <X size={16} />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2">

        <Item
          label="Keyboard Tab Navigation"
          icon={<span>⌨️</span>}
          onClick={() => console.log("keyboard navigation")}
        />

        <Item
          label="Read"
          icon={<span>🔊</span>}
          onClick={toggleRead}
        />

        <Item
          label="Contrast"
          icon={<span>◐</span>}
          onClick={toggleContrast}
        />

        <Item
          label="Larger Text"
          icon={<span>AA</span>}
          onClick={increaseText}
        />

        <Item
          label="Text Spacing"
          icon={<span>T↔</span>}
          onClick={changeSpacing}
        />

        <Item
          label="Play Animation"
          icon={<span>●●●</span>}
          onClick={toggleAnimations}
        />

      </div>

      {/* Footer */}
      <div className="bg-[#1c3f57] text-white text-xs">

        <button
          className="w-full py-2 border-t border-white/20 hover:bg-white/10"
          onClick={resetAccessibility}
        >
          Reset
        </button>

        <div className="px-3 py-2 border-t border-white/20 cursor-pointer hover:bg-white/10">
          Report a Problem
        </div>

        <div className="px-3 pb-3 cursor-pointer hover:underline">
          Accessibility Statement
        </div>

      </div>
    </div>
  );
};

export default AccessibilityPanel;