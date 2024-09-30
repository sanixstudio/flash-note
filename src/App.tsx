import React, { useState, useRef, useCallback, useEffect } from "react";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import Header from "./components/Header/Header";
import ActionBar from "./components/ActionBar/ActionBar";
import NoteItem from "./components/NoteItem/NoteItem";
import NoteInput from "./components/NoteInput/NoteInput";
import HistoryTab from "./components/HistoryTab/HistoryTab";
import AboutModal from "./components/AboutModal/AboutModal";
import { ScrollArea } from "./components/ui/scroll-area";
import { useNotes } from "./hooks/useNotes";
import { FaHistory, FaStickyNote } from "react-icons/fa";
import "./App.css";
import { useToast } from "./hooks/use-toast";
import { DeletedNote } from "./types";
import ReactQuill from "react-quill";

const App: React.FC = () => {
  const {
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
    toggleNotePin,
    restoreNote,
    deleteDeletedNote, // Add this new hook
  } = useNotes();

  const [noteInput, setNoteInput] = useState<string>("");
  const [isAddingNote, setIsAddingNote] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"notes" | "history">("notes");
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const quillRef = useRef<ReactQuill>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // Update the filteredNotes to sort pinned notes to the top and include category filtering
  const filteredNotes = notes
    .filter((note) =>
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const toggleNoteInput = () => {
    setIsAddingNote((prev) => !prev);
    if (!isAddingNote && textareaRef.current) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  };

  useEffect(() => {
    if (isAddingNote && quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.focus();
    }
  }, [isAddingNote]);

  const handleSaveNote = useCallback(() => {
    if (noteInput.trim()) {
      addNote(noteInput); // noteInput is now HTML content
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

  const handleClearAllHistory = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all deleted notes?")) {
      clearAllHistory();
    }
  }, [clearAllHistory]);

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

  const { toast } = useToast();

  const handleCopyNote = useCallback(
    (content: string) => {
      navigator.clipboard.writeText(content).then(
        () => {
          toast({
            title: "Note copied",
            description: "The note has been copied to your clipboard.",
          });
        },
        (err) => {
          console.error("Could not copy text: ", err);
          toast({
            variant: "destructive",
            title: "Failed to copy note",
            description:
              "An error occurred while copying the note to clipboard.",
          });
        }
      );
    },
    [toast]
  );

  const handleEditNote = useCallback(
    (id: number, newContent: string) => {
      editNote(id, newContent);
    },
    [editNote]
  );

  const handleRestoreNote = (note: DeletedNote) => {
    restoreNote(note);
    toast({
      title: "Note restored",
      description: "The note has been restored successfully.",
      duration: 2000,
    });
  };

  const handleDeleteDeletedNote = (id: number) => {
    deleteDeletedNote(id);
    toast({
      title: "Note deleted permanently",
      description: "The note has been removed from the history.",
      duration: 2000,
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    reorderNotes(result.source.index, result.destination.index);
  };

  const handleInfoClick = () => {
    setIsAboutModalOpen(true);
  };

  return (
    <div className="flex flex-col h-[600px] w-[350px] bg-bgColor text-textColor text-sm">
      <style>
        {`
          :root {
            --bg-color: #1a1a1a;
            --text-color: #ffffff;
            --input-bg: #2a2a2a;
            --border-color: #3a3a3a;
            --button-bg: #3a3a3a;
            --button-hover: #4a4a4a;
            --note-hover: #2a2a2a;
          }
        `}
      </style>
      {error && <div className="text-red-500 p-1 text-xs">{error}</div>}

      <div className="p-2 flex-shrink-0">
        <Header onSearchToggle={handleSearchToggle} onInfoClick={handleInfoClick} />

        {searchVisible && (
          <div ref={searchContainerRef} className="mb-2">
            <input
              ref={searchInputRef}
              type="text"
              className="search-input w-full p-1 bg-inputBg text-textColor rounded text-sm"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              onBlur={handleSearchBlur}
            />
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-grow">
            <ActionBar
              incompleteNotes={incompleteNotes}
              onClearAll={handleClearAll}
              onToggleNoteInput={toggleNoteInput}
            />
          </div>
        </div>

        {isAddingNote && (
          <NoteInput
            ref={quillRef}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            onSaveNote={handleSaveNote}
            onCancel={() => {
              setIsAddingNote(false);
              setNoteInput("");
            }}
            onBlur={handleNoteInputBlur}
          />
        )}
      </div>

      {activeTab === "notes" ? (
        <DragDropContext onDragEnd={onDragEnd}>
          <ScrollArea className="flex-grow px-2 pb-2">
            <Droppable droppableId="notes">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  {filteredNotes.map((note, index) => (
                    <NoteItem
                      key={note.id}
                      note={note}
                      index={index}
                      onToggleCompletion={toggleNoteCompletion}
                      onTogglePriority={toggleNotePriority}
                      onDelete={deleteNote}
                      onCopy={handleCopyNote}
                      onEdit={handleEditNote}
                      onTogglePin={toggleNotePin}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </ScrollArea>
        </DragDropContext>
      ) : (
        <HistoryTab
          deletedNotes={deletedNotes}
          onClearHistory={handleClearAllHistory}
          onRestoreNote={handleRestoreNote}
          onDeleteNote={handleDeleteDeletedNote}
        />
      )}

      <div className="flex justify-center items-center py-1 border-t border-borderColor">
        <button
          className={`flex items-center justify-center p-1 px-2 mx-1 rounded text-xs ${
            activeTab === "notes"
              ? "bg-gray-600 text-textColor"
              : "text-gray-400"
          } hover:bg-gray-700 transition-colors`}
          onClick={() => setActiveTab("notes")}
        >
          <FaStickyNote className="mr-1" size={10} />
          Notes
        </button>
        <button
          className={`flex items-center justify-center p-1 px-2 mx-1 rounded text-xs ${
            activeTab === "history"
              ? "bg-gray-600 text-textColor"
              : "text-gray-400"
          } hover:bg-gray-700 transition-colors`}
          onClick={() => setActiveTab("history")}
        >
          <FaHistory className="mr-1" size={10} />
          History
        </button>
      </div>

      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} />
    </div>
  );
};

export default App;