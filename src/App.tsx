import React, { useState, useEffect, useCallback, useRef } from "react";
import { format } from "date-fns";
import { FaTrash } from "react-icons/fa";
import Header from "./components/Header";
import ActionBar from "./components/ActionBar";
import NoteInput from "./components/NoteInput";
import "./App.css";
interface Note {
  id: number;
  content: string;
  createdAt: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [noteInput, setNoteInput] = useState<string>("");
  const [incompleteNotes, setIncompleteNotes] = useState<number>(0);
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const isChromeApiAvailable = (): boolean => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  };

  const getNotes = useCallback(() => {
    if (isChromeApiAvailable()) {
      chrome.storage.local.get("notes", (result) => {
        if (chrome.runtime.lastError) {
          setError("Error loading notes: " + chrome.runtime.lastError.message);
          return;
        }
        const savedNotes: Note[] = result.notes || [];
        setNotes(savedNotes);
        setIncompleteNotes(savedNotes.filter((note) => !note.completed).length);
      });
    } else {
      const savedNotes: Note[] = JSON.parse(
        localStorage.getItem("notes") || "[]"
      );
      setNotes(savedNotes);
      setIncompleteNotes(savedNotes.filter((note) => !note.completed).length);
    }
  }, []);

  const saveNotes = (updatedNotes: Note[]) => {
    if (isChromeApiAvailable()) {
      chrome.storage.local.set({ notes: updatedNotes }, () => {
        if (chrome.runtime.lastError) {
          setError("Error saving notes: " + chrome.runtime.lastError.message);
        }
      });
    } else {
      localStorage.setItem("notes", JSON.stringify(updatedNotes));
    }
  };

  const saveNote = () => {
    if (!noteInput.trim()) return;

    const newNote: Note = {
      id: Date.now(),
      content: noteInput.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);

    saveNotes(updatedNotes);
    setNoteInput("");
    setIsAddingNote(false);
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);
    saveNotes(updatedNotes);
  };

  const toggleNoteCompletion = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);
    saveNotes(updatedNotes);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  useEffect(() => {
    if (searchVisible && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchVisible &&
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setSearchVisible(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchVisible]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 w-80 bg-bgColor text-textColor">
      {error && <div className="text-red-500 mb-2">{error}</div>}

      <Header
        onSignIn={() => console.log("Sign In")}
        onSearchToggle={() => setSearchVisible(!searchVisible)}
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
          />
        </div>
      )}

      <ActionBar
        incompleteNotes={incompleteNotes}
        onClearAll={() => saveNotes([])}
        onToggleNoteInput={() => setIsAddingNote(!isAddingNote)}
      />

      {isAddingNote && (
        <NoteInput
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          onSaveNote={saveNote}
          onCancel={() => setIsAddingNote(false)}
        />
      )}

      <div id="notesList" className="overflow-y-auto max-h-60 scrollbar-hide">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`note p-2 mb-2 bg-inputBg border border-borderColor rounded ${
              note.completed ? "opacity-completed line-through" : ""
            } transition-transform transform hover:scale-105`}
          >
            <div className="flex justify-between items-center">
              <span
                onClick={() => toggleNoteCompletion(note.id)}
                className="note-content cursor-pointer flex-grow"
              >
                {note.content}
              </span>
              <button
                className="note-btn bg-transparent p-1 rounded text-gray-400 hover:text-textColor"
                onClick={() => deleteNote(note.id)}
              >
                <FaTrash />
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {format(new Date(note.createdAt), "MMM d, yyyy HH:mm")}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
