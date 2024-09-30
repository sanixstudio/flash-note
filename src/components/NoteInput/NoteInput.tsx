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
      <ReactQuill
        theme="snow"
        value={noteInput}
        onChange={setNoteInput}
        modules={quillModules}
        formats={quillFormats}
        onBlur={onBlur}
        placeholder="Enter your note..."
        className="quill-editor"
      />
      <div className="flex justify-end mt-2 space-x-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          onClick={onSaveNote}
        >
          Save
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
