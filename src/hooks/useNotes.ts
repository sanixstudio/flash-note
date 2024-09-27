import { useState, useCallback, useEffect } from "react";
import { Note } from "../types";

interface DeletedNote extends Note {
  deletedAt: string;
}

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletedNotes, setDeletedNotes] = useState<DeletedNote[]>([]);
  const [incompleteNotes, setIncompleteNotes] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const isChromeApiAvailable = (): boolean => {
    return !!(
      typeof chrome !== "undefined" &&
      chrome.storage &&
      chrome.storage.local
    );
  };

  const updateBadge = useCallback((count: number) => {
    if (isChromeApiAvailable()) {
      chrome.runtime.sendMessage({ action: "updateBadge", count });
    }
  }, []);

  const setIncompleteNotesAndUpdateBadge = useCallback(
    (count: number) => {
      setIncompleteNotes(count);
      updateBadge(count);
    },
    [updateBadge]
  );

  const getNotes = useCallback(() => {
    if (isChromeApiAvailable()) {
      chrome.storage.local.get("notes", (result) => {
        if (chrome.runtime.lastError) {
          setError("Error loading notes: " + chrome.runtime.lastError.message);
          return;
        }
        const savedNotes: Note[] = result.notes || [];
        setNotes(savedNotes);
        const incompleteCount = savedNotes.filter(
          (note) => !note.completed
        ).length;
        setIncompleteNotesAndUpdateBadge(incompleteCount);
      });
    } else {
      const savedNotes: Note[] = JSON.parse(
        localStorage.getItem("notes") || "[]"
      );
      setNotes(savedNotes);
      const incompleteCount = savedNotes.filter(
        (note) => !note.completed
      ).length;
      setIncompleteNotesAndUpdateBadge(incompleteCount);
    }
  }, [setIncompleteNotesAndUpdateBadge]);

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
    setIncompleteNotesAndUpdateBadge(
      updatedNotes.filter((note) => !note.completed).length
    );
    saveNotes(updatedNotes);
  };

  const deleteNote = (id: number) => {
    const noteToDelete = notes.find((note) => note.id === id);
    if (noteToDelete) {
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      setIncompleteNotesAndUpdateBadge(
        updatedNotes.filter((note) => !note.completed).length
      );
      saveNotes(updatedNotes);

      const deletedNote: DeletedNote = {
        ...noteToDelete,
        deletedAt: new Date().toISOString(),
      };
      setDeletedNotes((prev) => [deletedNote, ...prev]);
    }
  };

  const toggleNoteCompletion = (id: number) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, completed: !note.completed } : note
    );
    setNotes(updatedNotes);
    setIncompleteNotesAndUpdateBadge(
      updatedNotes.filter((note) => !note.completed).length
    );
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
    setIncompleteNotesAndUpdateBadge(0);
    saveNotes([]);
  };

  const reorderNotes = (startIndex: number, endIndex: number) => {
    const result = Array.from(notes);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    setNotes(result);
    saveNotes(result);
  };

  const clearOldDeletedNotes = useCallback(() => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    setDeletedNotes((prev) =>
      prev.filter((note) => new Date(note.deletedAt) > oneHourAgo)
    );
  }, []);

  useEffect(() => {
    getNotes();
    const interval = setInterval(clearOldDeletedNotes, 5 * 60 * 1000); // Run every 5 minutes
    return () => clearInterval(interval);
  }, [getNotes, clearOldDeletedNotes]);

  return {
    notes,
    deletedNotes,
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
