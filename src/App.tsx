import React, { useState, useRef, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
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
    reorderNotes,
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

  const handleClearAll = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all notes?")) {
      clearAllNotes();
    }
  }, [clearAllNotes]);

  useEffect(() => {
    if (searchVisible) {
      searchInputRef.current?.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey && event.key === "N") {
        event.preventDefault();
        setIsAddingNote(true);
        setTimeout(() => textareaRef.current?.focus(), 0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    reorderNotes(result.source.index, result.destination.index);
  };

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
          onClearAll={handleClearAll}
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

      <DragDropContext onDragEnd={onDragEnd}>
        <ScrollArea className="flex-grow px-4 pb-4">
          <Droppable droppableId="notes">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {filteredNotes.map((note, index) => (
                  <NoteItem
                    key={note.id}
                    note={note}
                    index={index}
                    onToggleCompletion={toggleNoteCompletion}
                    onTogglePriority={toggleNotePriority}
                    onDelete={deleteNote}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </ScrollArea>
      </DragDropContext>
    </div>
  );
};

export default App;
