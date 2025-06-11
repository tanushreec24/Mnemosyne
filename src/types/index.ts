export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export interface NoteLink {
  id: string;
  title: string;
  exists: boolean;
}