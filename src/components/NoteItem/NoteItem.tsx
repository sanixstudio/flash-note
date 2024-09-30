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
  FaClock,
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
          className={`note bg-inputBg border border-borderColor rounded w-full mb-2 relative ${
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
                padding: 0.5rem;
                background-color: rgba(0, 0, 0, 0.2);
                border-top-left-radius: 0.25rem;
                border-top-right-radius: 0.25rem;
                min-height: fit-content;
              }
              .ql-editor p {
                margin-bottom: 0;
              }
              .note-content .ql-editor {
                background-color: rgba(0, 0, 0, 0.2);
              }
              .note-content .ql-container {
                border: none;
              }
              .editing .ql-editor {
                background-color: rgba(0, 0, 0, 0.3);
              }
              .note-controls {
                background-color: rgba(0, 0, 0, 0.1);
                padding: 0.5rem;
                border-bottom-left-radius: 0.25rem;
                border-bottom-right-radius: 0.25rem;
              }
            `}
          </style>
          <div className="absolute top-1 right-1 flex items-center space-x-1 z-10">
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
              className={`note-btn bg-transparent p-1 rounded ${
                note.pinned ? "text-blue-400" : "text-gray-400"
              } hover:text-blue-500`}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(note.id);
              }}
            >
              <FaThumbtack size={14} />
            </button>
          </div>
          <div className={`note-content ${isEditing ? "editing" : ""}`}>
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
          <div className="note-controls">
            {isEditing ? (
              <div className="flex justify-end space-x-2">
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
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <FaClock size={12} className="mr-1" />
                  <span>{formatDate(note.createdAt.toISOString())}</span>
                </div>
                <div className="flex space-x-2">
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
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;