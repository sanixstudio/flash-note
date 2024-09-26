import React, { useEffect } from "react";

interface NoteInputProps {
  noteInput: string;
  setNoteInput: (value: string) => void;
  onSaveNote: () => void;
  onCancel: () => void;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  onBlur: () => void; // Add this line
}

const NoteInput: React.FC<NoteInputProps> = ({
  noteInput,
  setNoteInput,
  onSaveNote,
  onCancel,
  textareaRef,
  onBlur, // Add this line
}) => {
  useEffect(() => {
    textareaRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="inputContainer" className="mb-4">
      <textarea
        ref={textareaRef}
        className="w-full p-2 bg-inputBg text-textColor border border-borderColor rounded mb-2 min-h-[80px] max-h-[200px] resize-vertical"
        value={noteInput}
        onChange={(e) => setNoteInput(e.target.value)}
        placeholder="Write your note here..."
        onBlur={onBlur} // Add this line
      />
      <div className="flex gap-4">
        <button
          id="cancelNote"
          className="w-full bg-inputBg text-textColor p-2 rounded hover:bg-noteHover"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          id="saveNote"
          className="w-full bg-buttonBg text-textColor p-2 rounded hover:bg-buttonHover"
          onClick={onSaveNote}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default NoteInput;
