import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { DeletedNote } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { FaTrash } from "react-icons/fa";

interface HistoryTabProps {
  deletedNotes: DeletedNote[];
  onClearHistory: () => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({
  deletedNotes,
  onClearHistory,
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2">
        <h2 className="text-lg font-semibold">Deleted Notes</h2>
        <button
          className="flex items-center bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs transition-colors"
          onClick={onClearHistory}
        >
          <FaTrash className="mr-1" size={10} />
          Clear
        </button>
      </div>
      <ScrollArea className="flex-grow px-4 pb-4">
        <div className="space-y-2">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              className="note p-2 bg-inputBg border border-borderColor rounded w-full mb-2"
            >
              <div className="flex items-start justify-between">
                <span className="note-content flex-grow pr-2 break-words">
                  {note.content}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Deleted: {formatDate(note.deletedAt)}
              </div>
            </div>
          ))}
          {deletedNotes.length === 0 && (
            <div className="text-center text-gray-400">
              No deleted notes in the last hour
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default HistoryTab;
