import React from "react";
import { FaEraser, FaPlus } from "react-icons/fa";

interface ActionBarProps {
  incompleteNotes: number;
  onClearAll: () => void;
  onToggleNoteInput: () => void;
}

const ActionBar: React.FC<ActionBarProps> = ({
  incompleteNotes,
  onClearAll,
  onToggleNoteInput,
}) => {
  return (
    <div className="stats-container flex justify-between items-center">
      <div className="note-stats">
        <span id="incompleteNotes" className="text-yellow-400">
          Incomplete: {incompleteNotes}
        </span>
      </div>
      <div className="action-buttons flex items-center gap-2 ml-4">
        <button
          className="clear-all-btn bg-inputBg hover:bg-noteHover p-2 rounded-full transition-transform transform hover:scale-105"
          onClick={onClearAll}
          title="Clear all notes"
        >
          <FaEraser className="text-textColor" />
        </button>
        <button
          className="toggle-note-btn small bg-buttonBg hover:bg-buttonHover p-2 rounded-full transition-transform transform hover:scale-105"
          onClick={onToggleNoteInput}
        >
          <FaPlus className="text-textColor" />
        </button>
      </div>
    </div>
  );
};

export default ActionBar;
