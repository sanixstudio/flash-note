import { useState, useCallback, useEffect } from "react";
import { Note, DeletedNote } from "../types";

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
        const savedNotes: Note[] = (result.notes || []).map((note: Omit<Note, 'createdAt'> & { createdAt: string }) => ({
          ...note,
          createdAt: new Date(note.createdAt)
        }));
        setNotes(savedNotes);
        const incompleteCount = savedNotes.filter(
          (note) => !note.completed
        ).length;
        setIncompleteNotesAndUpdateBadge(incompleteCount);
      });
    } else {
      const savedNotes: Note[] = JSON.parse(
        localStorage.getItem("notes") || "[]"
      ).map((note: Omit<Note, 'createdAt'> & { createdAt: string }) => ({
        ...note,
        createdAt: new Date(note.createdAt)
      }));
      setNotes(savedNotes);
      const incompleteCount = savedNotes.filter(
        (note) => !note.completed
      ).length;
      setIncompleteNotesAndUpdateBadge(incompleteCount);
    }
  }, [setIncompleteNotesAndUpdateBadge]);

  const saveNotes = (updatedNotes: Note[]) => {
    const notesToSave = updatedNotes.map(note => ({
      ...note,
      createdAt: note.createdAt.toISOString()
    }));
    if (isChromeApiAvailable()) {
      chrome.storage.local.set({ notes: notesToSave }, () => {
        if (chrome.runtime.lastError) {
          setError("Error saving notes: " + chrome.runtime.lastError.message);
        }
      });
    } else {
      localStorage.setItem("notes", JSON.stringify(notesToSave));
    }
  };

  const addNote = (content: string) => {
    const newNote: Note = {
      id: Date.now(),
      content: content.trim(),
      createdAt: new Date(),
      completed: false,
      priority: false,
      pinned: false,
    };
    const updatedNotes = [newNote, ...notes];
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

  const clearAllHistory = useCallback(() => {
    setDeletedNotes([]);
  }, []);

  useEffect(() => {
    getNotes();
    const interval = setInterval(clearOldDeletedNotes, 5 * 60 * 1000); // Run every 5 minutes
    return () => clearInterval(interval);
  }, [getNotes, clearOldDeletedNotes]);

  const editNote = useCallback((id: number, newContent: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, content: newContent } : note
      )
    );
  }, []);

  const changeNoteCategory = useCallback((id: number, category: string) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, category } : note))
    );
  }, []);

  const toggleNotePin = useCallback((id: number) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  }, []);

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
    clearAllHistory,
    reorderNotes,
    editNote,
    changeNoteCategory,
    toggleNotePin,
  };
};
