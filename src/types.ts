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
