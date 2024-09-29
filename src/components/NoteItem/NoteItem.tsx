import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  FaTrash,
  FaStar,
  FaCopy,
  FaEdit,
  FaSave,
  FaTimes,
  FaThumbtack,
} from "react-icons/fa";
import { Note } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NoteItemProps {
  note: Note;
  index: number;
  onToggleCompletion: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onDelete: (id: number) => void;
  onCopy: (content: string) => void;
  onEdit: (id: number, newContent: string) => void;
  onTogglePin: (id: number) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  index,
  onToggleCompletion,
  onTogglePriority,
  onDelete,
  onCopy,
  onEdit,
  onTogglePin,
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleNoteClick = (event: React.MouseEvent) => {
    if (!(event.target as HTMLElement).closest(".note-btn")) {
      onToggleCompletion(note.id);
    }
  };

  const handleCopy = () => {
    onCopy(note.content);
    toast({
      title: "Copied",
      description: "Note content copied to clipboard",
      duration: 500,
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedContent.trim() !== note.content) {
      onEdit(note.id, editedContent);
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
        duration: 2000,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={note.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`note p-2 bg-inputBg border border-borderColor rounded w-full mb-2 relative ${
            note.completed ? "opacity-40 line-through" : ""
          } ${note.priority ? "border-yellow-400 bg-yellow-400/10" : ""} ${
            note.pinned ? "border-blue-400 bg-blue-400/10" : ""
          } transition-transform hover:scale-[1.02] cursor-pointer`}
          onClick={isEditing ? undefined : handleNoteClick}
        >
          <style>
            {`
              .ql-editor {
                color: var(--text-color);
                padding: 0;
              }
              .ql-editor p {
                margin-bottom: 0;
              }
              .note-content .ql-editor {
                background-color: transparent;
              }
              .note-content .ql-container {
                border: none;
              }
              .editing .ql-editor {
                background-color: var(--input-bg);
              }
            `}
          </style>
          <button
            className={`note-btn absolute top-1 right-1 bg-transparent p-1 rounded ${
              note.pinned ? "text-blue-400" : "text-gray-400"
            } hover:text-blue-500`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(note.id);
            }}
          >
            <FaThumbtack size={14} />
          </button>
          <div
            className={`flex items-start justify-between mb-2 ${
              isEditing ? "editing" : "note-content"
            }`}
          >
            <span className="flex-grow pr-2 break-words">
              {isEditing ? (
                <ReactQuill
                  theme="snow"
                  value={editedContent}
                  onChange={setEditedContent}
                  modules={{ toolbar: false }}
                />
              ) : (
                <div
                  className="ql-editor"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              )}
            </span>
          </div>
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatDate(note.createdAt.toISOString())}</span>
            </div>
            <div className="flex justify-end space-x-1">
              {isEditing ? (
                <>
                  <button
                    className="note-btn bg-transparent p-1 rounded text-green-500 hover:text-green-600"
                    onClick={handleSave}
                  >
                    <FaSave size={14} />
                  </button>
                  <button
                    className="note-btn bg-transparent p-1 rounded text-red-500 hover:text-red-600"
                    onClick={handleCancel}
                  >
                    <FaTimes size={14} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={`note-btn bg-transparent p-1 rounded ${
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
                    className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit();
                    }}
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-blue-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy();
                    }}
                  >
                    <FaCopy size={14} />
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
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;