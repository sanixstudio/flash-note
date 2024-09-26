import React from "react";
import { FaTrash, FaStar } from "react-icons/fa";
import { Note } from "@/types";
import { formatDate } from "@/utils/dateUtils";

interface NoteItemProps {
  note: Note;
  onToggleCompletion: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onDelete: (id: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  onToggleCompletion,
  onTogglePriority,
  onDelete,
}) => {
  const handleNoteClick = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".note-btn")) {
      onToggleCompletion(note.id);
    }
  };

  return (
    <div
      className={`note p-2 bg-inputBg border border-borderColor rounded w-full mb-2 ${
        note.completed ? "opacity-50 line-through" : ""
      } ${
        note.priority ? "border-yellow-400" : ""
      } transition-transform hover:scale-[1.02] cursor-pointer`}
      onClick={handleNoteClick}
    >
      <div className="flex items-start justify-between">
        <span className="note-content flex-grow pr-2 break-words">
          {note.content}
        </span>
        <div className="flex items-center flex-shrink-0">
          <button
            className={`note-btn bg-transparent p-1 rounded mr-1 ${
              note.priority ? "text-yellow-400" : "text-gray-400"
            } hover:text-yellow-500`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePriority(note.id);
            }}
          >
            <FaStar size={14} />
          </button>
          <button
            className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      <div className="text-xs text-gray-400 mt-1">
        {formatDate(note.createdAt)}
      </div>
    </div>
  );
};

export default NoteItem;
