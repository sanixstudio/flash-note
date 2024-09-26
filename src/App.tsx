import React, { useState, useEffect } from "react";
import { format } from "date-fns";

// Define a Note type for better type safety
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
  const [error, setError] = useState<string | null>(null);

  // Function to check if Chrome API is available
  const isChromeApiAvailable = () => {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local;
  };

  // Function to get notes from storage
  const getNotes = () => {
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
      const savedNotes: Note[] = JSON.parse(localStorage.getItem("notes") || "[]");
      setNotes(savedNotes);
      setIncompleteNotes(savedNotes.filter((note) => !note.completed).length);
    }
  };

  // Function to save notes to storage
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

  // Load notes when the component mounts
  useEffect(() => {
    getNotes();
  }, []);

  // Function to save a new note
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

  // Function to delete a note by ID
  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);
    saveNotes(updatedNotes);
  };

  // Function to toggle note completion
  const toggleNoteCompletion = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);
    saveNotes(updatedNotes);
  };

  return (
    <div className="p-4 w-80 bg-gray-800 text-white rounded-lg">
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Flash Notes</h1>
        <button
          className="bg-green-500 p-2 rounded"
          onClick={() => setIsAddingNote(!isAddingNote)}
        >
          {isAddingNote ? "Cancel" : "Add Note"}
        </button>
      </div>
      {isAddingNote && (
        <div className="mb-4">
          <textarea
            className="w-full p-2 bg-gray-700 text-white rounded mb-2"
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            placeholder="Write your note here..."
          />
          <button className="bg-blue-500 w-full p-2 rounded" onClick={saveNote}>
            Save Note
          </button>
        </div>
      )}
      <div className="mb-4">
        <span className="text-yellow-400">Incomplete: {incompleteNotes}</span>
      </div>
      <div className="overflow-y-auto max-h-60">
        {notes.map((note) => (
          <div
            key={note.id}
            className={`p-2 bg-gray-700 mb-2 rounded ${
              note.completed ? "opacity-50 line-through" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <span
                onClick={() => toggleNoteCompletion(note.id)}
                className="cursor-pointer flex-grow"
              >
                {note.content}
              </span>
              <button
                className="bg-red-500 p-1 rounded ml-2"
                onClick={() => deleteNote(note.id)}
              >
                Delete
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
