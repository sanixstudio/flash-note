import React, { useState, useRef, useCallback, useEffect } from "react";
import Header from "./components/Header/Header";
import ActionBar from "./components/ActionBar/ActionBar";
import NoteItem from "./components/NoteItem/NoteItem";
import NoteInput from "./components/NoteInput/NoteInput";
import { ScrollArea } from "./components/ui/scroll-area";
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Alt+Shift+N (Windows/Linux) or Option+Shift+N (Mac)
      if (event.altKey && event.shiftKey && event.key === "N") {
        event.preventDefault(); // Prevent the default browser action
        setIsAddingNote(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    };

    // Add the event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove the event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex flex-col h-[600px] w-[350px] bg-bgColor text-textColor">
      {error && <div className="text-red-500 p-2">{error}</div>}

      <div className="p-4 flex-shrink-0">
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
      </div>

      <ScrollArea className="flex-grow px-4 pb-4">
        <div className="pr-2 space-y-2">
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
      </ScrollArea>
    </div>
  );
};

export default App;
