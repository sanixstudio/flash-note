export interface Note {
  id: number;
  content: string;
  completed: boolean;
  priority: boolean;
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  onTogglePin: (id: number) => void;
}
