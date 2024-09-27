import React from "react";
import { ScrollArea } from "../ui/scroll-area";
import { DeletedNote } from "@/types";
import { formatDate } from "@/utils/dateUtils";

interface HistoryTabProps {
  deletedNotes: DeletedNote[];
}

const HistoryTab: React.FC<HistoryTabProps> = ({ deletedNotes }) => {
  return (
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
          <div className="text-center text-gray-400">No deleted notes in the last hour</div>
        )}
      </div>
    </ScrollArea>
  );
};

export default HistoryTab;