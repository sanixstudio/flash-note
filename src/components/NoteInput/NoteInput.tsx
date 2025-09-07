import React, { forwardRef, useRef, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";

interface NoteInputProps {
  noteInput: string;
  setNoteInput: React.Dispatch<React.SetStateAction<string>>;
  onSaveNote: () => void;
  onCancel: () => void;
  onBlur: () => void;
}

const NoteInput = forwardRef<HTMLDivElement, NoteInputProps>(
  ({ noteInput, setNoteInput, onSaveNote, onCancel, onBlur }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          onCancel();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [onCancel]);

    // MDEditor configuration - only valid props
    const editorConfig = {
      preview: "edit" as const,
      hideToolbar: false,
    };

    return (
      <div ref={containerRef} className="mb-2">
        <style>
          {`
          .w-md-editor {
            background-color: var(--inputBg) !important;
            border-radius: 0.25rem;
          }
          .w-md-editor-text-container {
            background-color: var(--inputBg) !important;
            color: var(--text-color) !important;
          }
          .w-md-editor-text {
            background-color: var(--inputBg) !important;
            color: var(--text-color) !important;
            min-height: 150px;
            max-height: 300px;
            overflow-y: auto;
          }
          .w-md-editor-text-input {
            background-color: var(--inputBg) !important;
            color: var(--text-color) !important;
          }
          .w-md-editor-toolbar {
            background-color: rgba(0, 0, 0, 0.2) !important;
            border: none !important;
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
          }
          .w-md-editor-toolbar button {
            color: var(--text-color) !important;
          }
          .w-md-editor-toolbar button:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        `}
        </style>
        <div ref={ref}>
          <MDEditor
            value={noteInput}
            onChange={(val) => setNoteInput(val || "")}
            onBlur={onBlur}
            data-color-mode="dark"
            {...editorConfig}
          />
        </div>
        <div className="flex justify-end mt-2 space-x-2">
          <button
            className="px-3 py-1 bg-gray-600 text-white rounded opacity-100 hover:bg-gray-500 transition-colors duration-200"
            onClick={onSaveNote}
          >
            Save
          </button>
          <button
            className="px-3 py-1 bg-gray-500 text-white rounded opacity-100 hover:bg-gray-400 transition-colors duration-200"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
);

export default NoteInput;
