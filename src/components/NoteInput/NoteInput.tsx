import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface NoteInputProps {
  noteInput: string;
  setNoteInput: React.Dispatch<React.SetStateAction<string>>;
  onSaveNote: () => void;
  onCancel: () => void;
  onBlur: () => void;
}

const NoteInput: React.FC<NoteInputProps> = ({
  noteInput,
  setNoteInput,
  onSaveNote,
  onCancel,
  onBlur,
}) => {
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
    <div className="mb-2">
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
        `}
      </style>
      <ReactQuill
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
          className="px-3 py-1 bg-green-500 text-white rounded opacity-50 hover:opacity-100 transition-opacity duration-200"
          onClick={onSaveNote}
        >
          Save
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded opacity-50 hover:opacity-100 transition-opacity duration-200"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
