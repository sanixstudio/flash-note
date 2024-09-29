export interface Note {
  id: number;
  content: string;
  createdAt: string;
  completed: boolean;
  priority: boolean;
}

export interface DeletedNote extends Note {
  deletedAt: string;
}
export interface NoteItemProps {
  note: Note;
  index: number;
  onToggleCompletion: (id: number) => void;
  onTogglePriority: (id: number) => void;
  onDelete: (id: number) => void;
  onCopy: (content: string) => void;
  onEdit: (id: number, newContent: string) => void;
}

