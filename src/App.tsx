import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "./components/Header/Header";
import ActionBar from "./components/ActionBar/ActionBar";
import NoteItem from "./components/NoteItem/NoteItem";
import NoteInput from "./components/NoteInput/NoteInput";
import { useNotes } from "./hooks/useNotes";
import "./App.css";

const App: React.FC = () => {
  const {
    notes,
    incompleteNotes,
    error,
    addNote,
    deleteNote,
    toggleNoteCompletion,
    toggleNotePriority,
    clearAllNotes,
  } = useNotes();

  const [noteInput, setNoteInput] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleNoteInput = () => {
    setIsAddingNote((prev) => !prev);
    if (!isAddingNote && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  const handleSaveNote = useCallback(() => {
    if (noteInput.trim()) {
      addNote(noteInput);
      setNoteInput("");
      setIsAddingNote(false);
    }
  }, [noteInput, addNote]);

  const handleSearchBlur = useCallback(() => {
    if (!searchTerm.trim()) {
      setSearchVisible(false);
      setSearchTerm("");
    }
  }, [searchTerm]);

  const handleNoteInputBlur = useCallback(() => {
    if (!noteInput.trim()) {
      setIsAddingNote(false);
      setNoteInput("");
    }
  }, [noteInput]);

  const handleSearchToggle = useCallback(() => {
    setSearchVisible((prev) => !prev);
    if (!searchVisible) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [searchVisible]);

  useEffect(() => {
    if (searchVisible) {
      searchInputRef.current?.focus();
    }
  }, [searchVisible]);

  return (
    <div className="p-4 w-80 bg-bgColor text-textColor h-screen">
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <Header
        onSignIn={() => console.log("Sign In")}
        onSearchToggle={handleSearchToggle}
      />

      {searchVisible && (
        <div ref={searchContainerRef} className="mb-4">
          <input
            ref={searchInputRef}
            type="text"
            className="search-input w-full p-2 bg-inputBg text-textColor rounded"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            onBlur={handleSearchBlur}
          />
        </div>
      )}

      <ActionBar
        incompleteNotes={incompleteNotes}
        onClearAll={clearAllNotes}
        onToggleNoteInput={toggleNoteInput}
      />

      {isAddingNote && (
        <NoteInput
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          onSaveNote={handleSaveNote}
          onCancel={() => {
            setIsAddingNote(false);
            setNoteInput("");
          }}
          textareaRef={textareaRef}
          onBlur={handleNoteInputBlur}
        />
      )}

      <div id="notesList" className=" h-64 scrollbar-hide">
        {filteredNotes.map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onToggleCompletion={toggleNoteCompletion}
            onTogglePriority={toggleNotePriority}
            onDelete={deleteNote}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
