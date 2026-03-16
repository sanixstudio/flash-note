import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import {
  FaTrash,
  FaStar,
  FaCopy,
  FaEdit,
  FaThumbtack,
  FaClock,
  FaRegCheckSquare,
  FaRegSquare,
} from "react-icons/fa";
import { NoteItemProps } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { sanitizeHtml } from "@/utils/sanitize";
import { useToast } from "@/hooks/use-toast";
import NoteEditor from "@/components/NoteEditor/NoteEditor";

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

  const handleEditorSave = (html: string) => {
    if (html !== note.content) {
      onEdit(note.id, html);
      toast({
        title: "Note updated",
        description: "Your note has been successfully updated.",
        duration: 1000,
      });
    }
    setIsEditing(false);
  };

  const handleEditorCancel = () => {
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={note.id.toString()} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-bgColor border rounded w-full mb-2 relative transition-all duration-200 hover:group ${
            note.priority
              ? "border-yellow-400 bg-yellow-400/20"
              : note.completed
              ? "border-emerald-500/50 bg-emerald-500/10 opacity-30"
              : "border-borderColor"
          } ${note.pinned ? "border-gray-300/50 bg-gray-300/20" : ""} ${
            snapshot.isDragging ? "shadow-lg transform rotate-1" : ""
          }`}
        >
          <div 
            {...provided.dragHandleProps}
            className="flex justify-between items-center bg-gray-800 p-1 rounded-t-sm cursor-grab hover:bg-gray-700 transition-colors"
            title="Click and hold to drag"
          >
            <div className="text-xs text-gray-400">
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
                onMouseDown={(e) => e.stopPropagation()}
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
                onMouseDown={(e) => e.stopPropagation()}
              >
                <FaThumbtack size={14} />
              </button>
            </div>
          </div>
          <div className={`p-2 bg-black/20 ${isEditing ? "bg-black/30" : ""}`}>
            {isEditing ? (
              <NoteEditor
                initialContent={note.content}
                onSave={handleEditorSave}
                onCancel={handleEditorCancel}
              />
            ) : (
              <div
                className={`note-content text-[var(--text-color)] p-2 bg-black/20 rounded-t-sm min-h-fit ${
                  note.completed ? "line-through" : ""
                }`}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(note.content) }}
              />
            )}
          </div>
          <div className="note-controls flex justify-end space-x-2">
            {!isEditing && (
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
