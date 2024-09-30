import React from "react";
import { DeletedNote } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { FaClock, FaUndo, FaTrash } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface HistoryTabProps {
  deletedNotes: DeletedNote[];
  onClearHistory: () => void;
  onRestoreNote: (note: DeletedNote) => void;
  onDeleteNote: (id: number) => void;
}

const HistoryTab: React.FC<HistoryTabProps> = ({
  deletedNotes,
  onClearHistory,
  onRestoreNote,
  onDeleteNote,
}) => {
  return (
    <div className="flex-grow overflow-auto px-2">
      <style>
        {`
          .ql-editor {
            padding: 0.5rem;
            color: var(--text-color);
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 0.25rem;
            min-height: 100px;
          }
          .ql-editor p {
            margin-bottom: 0;
          }
          .deleted-note .ql-editor {
            background-color: transparent;
          }
          .deleted-note {
            opacity: 0.7;
            transition: opacity 0.2s ease-in-out;
          }
          .deleted-note:hover {
            opacity: 1;
          }
          .note-btn {
            opacity: 0.5;
            transition: opacity 0.2s ease-in-out;
          }
          .deleted-note:hover .note-btn {
            opacity: 1;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Deleted Notes</h2>
        {deletedNotes.length > 0 && (
          <button
            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-500 transition-colors"
            onClick={onClearHistory}
          >
            Clear All History
          </button>
        )}
      </div>
      {deletedNotes.length === 0 ? (
        <p className="text-gray-400 text-center mt-8">No deleted notes</p>
      ) : (
        <div className="space-y-4">
          {deletedNotes.map((note) => (
            <div
              key={note.id}
              className={`deleted-note bg-bgColor border border-borderColor rounded w-full mb-2 relative ${
                note.priority ? "border-gray-400 bg-gray-700/30" : ""
              } ${note.pinned ? "border-gray-300 bg-gray-600/30" : ""}`}
            >
              <div className="flex justify-between items-center bg-gray-800 p-1 rounded-t">
                <span className="text-xs text-gray-400">
                  <FaClock className="inline mr-1" />
                  Deleted: {formatDate(note.deletedAt)}
                </span>
              </div>
              <div className="p-2">
                <ReactQuill
                  value={note.content}
                  readOnly={true}
                  theme="bubble"
                  modules={{ toolbar: false }}
                />
              </div>
              <div className="flex justify-end p-2 bg-gray-800 rounded-b">
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-gray-100 mr-2"
                  onClick={() => onRestoreNote(note)}
                  title="Restore Note"
                >
                  <FaUndo size={14} />
                </button>
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={() => onDeleteNote(note.id)}
                  title="Delete Permanently"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryTab;
