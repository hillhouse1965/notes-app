export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export function isNoteValid({ title, content }: NoteInput): boolean {
  return title.trim().length > 0 && content.trim().length > 0;
}
