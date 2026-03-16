import React from "react";
import { FaEraser } from "react-icons/fa";

interface ActionBarProps {
  incompleteNotes: number;
  onClearAll: () => void;
}

/**
 * Secondary actions bar: incomplete count and Clear all.
 * Capture is primary and lives above this (in CaptureInput).
 */
const ActionBar: React.FC<ActionBarProps> = ({
  incompleteNotes,
  onClearAll,
}) => {
  return (
    <div className="stats-container flex justify-between items-center gap-2 min-h-[28px]">
      <span id="incompleteNotes" className="text-red-400 text-xs tabular-nums">
        Incomplete: {incompleteNotes}
      </span>
      <button
        className="clear-all-btn shrink-0 bg-inputBg hover:bg-noteHover p-1.5 rounded-full transition-colors"
        onClick={onClearAll}
        title="Clear all notes"
        aria-label="Clear all notes"
      >
        <FaEraser className="text-textColor" size={14} />
      </button>
    </div>
  );
};

export default ActionBar;
