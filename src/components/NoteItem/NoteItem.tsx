import React, { useState, useEffect, useRef } from "react";
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
  FaRegCheckSquare,
  FaRegSquare,
} from "react-icons/fa";
import { Note } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";
import MDEditor from "@uiw/react-md-editor";

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
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isEditing && editorRef.current) {
      // Focus the editor when editing starts
      const textArea = editorRef.current.querySelector('textarea');
      if (textArea) {
        textArea.focus();
      }
    }
  }, [isEditing]);

  const handleCopy = () => {
    onCopy(note.content);
    toast({
      title: "Copied",
      description: "Note content copied to clipboard",
      duration: 1000,
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
        duration: 1000,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedContent(note.content);
    setIsEditing(false);
  };

  // MDEditor configuration for inline editing - only valid props
  const editorConfig = {
    preview: "edit" as const,
    hideToolbar: false,
  };

  return (
    <Draggable draggableId={note.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-bgColor border rounded w-full mb-2 relative transition-transform hover:group ${
            note.priority
              ? "border-yellow-400 bg-yellow-400/20"
              : note.completed
              ? "border-emerald-500/50 bg-emerald-500/10 opacity-30"
              : "border-borderColor"
          } ${note.pinned ? "border-gray-300/50 bg-gray-300/20" : ""}`}
        >
          <div className="flex justify-between items-center bg-gray-800 p-1 rounded-t-sm">
            <div className="text-xs text-gray-400 ml-1">
              <FaClock size={12} className="inline mr-1" />
              <span>
                {note.updatedAt && note.updatedAt > note.createdAt
                  ? `Updated ${formatDate(note.updatedAt.toISOString())}`
                  : formatDate(note.createdAt.toISOString())}
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <button
                className={`bg-transparent p-1 rounded ${
                  note.priority ? "text-yellow-400" : "text-gray-400"
                } hover:text-yellow-400`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePriority(note.id);
                }}
              >
                <FaStar size={14} />
              </button>
              <button
                className={`bg-transparent p-1 rounded ${
                  note.pinned ? "text-gray-200" : "text-gray-400"
                } hover:text-gray-100`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(note.id);
                }}
              >
                <FaThumbtack size={14} />
              </button>
            </div>
          </div>
          <div className={`p-2 bg-black/20 ${isEditing ? "bg-black/30" : ""}`}>
            {isEditing ? (
              <div ref={editorRef}>
                <MDEditor
                  value={editedContent}
                  onChange={(val) => setEditedContent(val || "")}
                  data-color-mode="dark"
                  {...editorConfig}
                />
              </div>
            ) : (
              <div
                className={`text-[var(--text-color)] p-2 bg-black/20 rounded-t-sm min-h-fit ${
                  note.completed ? "line-through" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            )}
          </div>
          <div
            className={`note-controls ${
              isEditing
                ? "flex justify-end space-x-2"
                : "flex justify-end space-x-2"
            }`}
          >
            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <button
                  className="bg-transparent p-1 rounded text-gray-300 hover:text-gray-100"
                  onClick={handleSave}
                >
                  <FaSave size={14} />
                </button>
                <button
                  className="bg-transparent p-1 rounded text-gray-300 hover:text-gray-100"
                  onClick={handleCancel}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ) : (
              <div className="flex justify-end space-x-2 w-full">
                <div className="w-full p-2">
                  <button
                    className="flex items-center gap-2 text-gray-400 hover:text-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCompletion(note.id);
                    }}
                    title={
                      note.completed ? "Mark as incomplete" : "Mark as complete"
                    }
                  >
                    {note.completed ? (
                      <FaRegCheckSquare size={16} />
                    ) : (
                      <FaRegSquare size={16} />
                    )}
                    <span className="text-sm text-emerald-500/70 hover:text-emerald-400">
                      {note.completed ? "Done" : "Mark as Done"}
                    </span>
                  </button>
                </div>
                <button
                  className="bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <FaEdit size={14} />
                </button>
                <button
                  className="bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                >
                  <FaCopy size={14} />
                </button>
                <button
                  className="bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(note.id);
                  }}
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default NoteItem;
