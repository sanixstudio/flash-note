import { useState, useCallback, useEffect } from "react";
import { Note } from "../types";

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [incompleteNotes, setIncompleteNotes] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

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

  const addNote = (content: string) => {
    const newNote: Note = {
      id: Date.now(),
      content: content.trim(),
      createdAt: new Date().toISOString(),
      completed: false,
      priority: false,
    };
    const updatedNotes = [newNote, ...notes]; // Add new note at the beginning
    setNotes(updatedNotes);
    setIncompleteNotes(updatedNotes.filter((note) => !note.completed).length);
    saveNotes(updatedNotes);
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

  const toggleNotePriority = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, priority: !note.priority } : note
    );
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const clearAllNotes = () => {
    setNotes([]);
    setIncompleteNotes(0);
    saveNotes([]);
  };

  const reorderNotes = (startIndex: number, endIndex: number) => {
    const result = Array.from(notes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setNotes(result);
    saveNotes(result);
  };

  useEffect(() => {
    getNotes();
  }, [getNotes]);

  return {
    notes,
    incompleteNotes,
    error,
    addNote,
    deleteNote,
    toggleNoteCompletion,
    toggleNotePriority,
    clearAllNotes,
    reorderNotes,
  };
};
