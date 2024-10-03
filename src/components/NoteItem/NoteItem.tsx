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
  const quillRef = useRef<ReactQuill>(null);

  useEffect(() => {
    if (isEditing && quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.focus();
    }
  }, [isEditing]);

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

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link'
  ];

  return (
    <Draggable draggableId={note.id.toString()} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`note bg-bgColor border rounded w-full mb-2 relative
            ${note.priority ? "border-yellow-400 bg-yellow-400/20" : "border-borderColor"}
            ${note.pinned ? "border-gray-300/50 bg-gray-300/20" : ""}
            ${note.completed ? "opacity-30" : ""}
            transition-transform hover:scale-[1.02] cursor-pointer group`}
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
              .note-content.completed .ql-editor {
                text-decoration: line-through;
              }
              .note-content .ql-container {
                border: none;
              }
              .editing .ql-editor {
                background-color: rgba(0, 0, 0, 0.3);
              }
              .ql-toolbar {
                background-color: rgba(0, 0, 0, 0.3);
                border: none;
                border-top-left-radius: 0.25rem;
                border-top-right-radius: 0.25rem;
              }
              .ql-toolbar .ql-stroke {
                stroke: var(--text-color);
              }
              .ql-toolbar .ql-fill {
                fill: var(--text-color);
              }
              .ql-toolbar .ql-picker {
                color: var(--text-color);
              }
              .note-btn {
                opacity: 0.5;
                transition: opacity 0.2s ease-in-out;
              }
              .group:hover .note-btn,
              .note-btn:focus,
              .note-btn.active,
              .editing .note-btn {
                opacity: 1;
              }
              .note-btn.priority-active {
                color: #fbbf24; /* Tailwind's yellow-400 */
              }
            `}
          </style>
          <div className="flex justify-between items-center bg-gray-800 p-1 rounded-t">
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
                className={`note-btn bg-transparent p-1 rounded ${
                  note.priority ? "priority-active" : "text-gray-400"
                } hover:text-yellow-400`}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePriority(note.id);
                }}
              >
                <FaStar size={14} />
              </button>
              <button
                className={`note-btn bg-transparent p-1 rounded ${
                  note.pinned ? "text-gray-200 active" : "text-gray-400"
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
          <div className={`note-content ${isEditing ? "editing" : ""} ${note.completed ? "completed" : ""}`}>
            {isEditing ? (
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={editedContent}
                onChange={setEditedContent}
                modules={quillModules}
                formats={quillFormats}
              />
            ) : (
              <div
                className="ql-editor"
                dangerouslySetInnerHTML={{ __html: note.content }}
              />
            )}
          </div>
          <div className={`note-controls ${isEditing ? "editing" : ""}`}>
            {isEditing ? (
              <div className="flex justify-end space-x-2">
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-300 hover:text-gray-100"
                  onClick={handleSave}
                >
                  <FaSave size={14} />
                </button>
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-300 hover:text-gray-100"
                  onClick={handleCancel}
                >
                  <FaTimes size={14} />
                </button>
              </div>
            ) : (
              <div className="flex justify-end space-x-2">
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit();
                  }}
                >
                  <FaEdit size={14} />
                </button>
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy();
                  }}
                >
                  <FaCopy size={14} />
                </button>
                <button
                  className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-gray-100"
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