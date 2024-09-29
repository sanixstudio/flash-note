import React from 'react';

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
  onBlur
}) => {
  return (
    <div className="mb-2">
      <textarea
        className="w-full p-2 bg-inputBg text-textColor border border-borderColor rounded"
        rows={3}
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        onBlur={onBlur}
        placeholder="Enter your note..."
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded mr-2"
          onClick={onSaveNote}
        >
          Save
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
