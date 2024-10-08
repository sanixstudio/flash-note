import React, { forwardRef, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NoteInputProps {
  noteInput: string;
  setNoteInput: React.Dispatch<React.SetStateAction<string>>;
  onSaveNote: () => void;
  onCancel: () => void;
  onBlur: () => void;
}

const NoteInput = forwardRef<ReactQuill, NoteInputProps>(
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

    const quillModules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link"],
        ["clean"],
      ],
    };

    const quillFormats = [
      "bold",
      "italic",
      "underline",
      "strike",
      "list",
      "bullet",
      "link",
    ];

    return (
      <div ref={containerRef} className="mb-2">
        <style>
          {`
          .ql-editor {
            min-height: 150px;
            max-height: 300px;
            overflow-y: auto;
          }
          .ql-toolbar {
            background-color: rgba(0, 0, 0, 0.2);
            border: none !important;
            border-top-left-radius: 0.25rem;
            border-top-right-radius: 0.25rem;
          }
          .ql-container {
            border: none !important;
            border-bottom-left-radius: 0.25rem;
            border-bottom-right-radius: 0.25rem;
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
          .ql-editor.ql-blank::before {
            color: rgba(255, 255, 255, 0.5);
          }
        `}
        </style>
        <ReactQuill
          ref={ref}
          theme="snow"
          value={noteInput}
          onChange={setNoteInput}
          modules={quillModules}
          formats={quillFormats}
          onBlur={onBlur}
          placeholder="Enter your note..."
          className="bg-inputBg text-textColor rounded"
        />
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
