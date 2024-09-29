import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { FaTrash, FaStar, FaCopy, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { Note } from "@/types";
import { formatDate } from "@/utils/dateUtils";
import { useToast } from "@/hooks/use-toast";

interface NoteItemProps {
  note: Note;
  index: number;
  onToggleCompletion: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onDelete: (id: number) => void;
  onCopy: (content: string) => void;
  onEdit: (id: number, newContent: string) => void;
}

const NoteItem: React.FC<NoteItemProps> = ({
  note,
  index,
  onToggleCompletion,
  onTogglePriority,
  onDelete,
  onCopy,
  onEdit,
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
      duration: 500, // half second
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
          className={`note p-2 bg-inputBg border border-borderColor rounded w-full mb-2 ${
            note.completed ? "opacity-40 line-through" : ""
          } ${
            note.priority ? "border-yellow-400 bg-yellow-400/10" : ""
          } transition-transform hover:scale-[1.02] cursor-pointer`}
          onClick={isEditing ? undefined : handleNoteClick}
        >
          <div className="flex items-start justify-between">
            {isEditing ? (
              <textarea
                className="w-full p-1 bg-inputBg text-textColor border border-borderColor rounded"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoFocus
              />
            ) : (
              <span className="note-content flex-grow pr-2 break-words">
                {note.content}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="text-xs text-gray-400">
              {formatDate(note.createdAt)}
            </div>
            <div className="flex space-x-1">
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
