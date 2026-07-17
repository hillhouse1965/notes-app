import type { Note } from "@/types/note";

type DbNote = {
  id: string;
  title: string;
  content: string;
  updatedAt: Date;
};

export function serializeNote(note: DbNote): Note {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    updatedAt: note.updatedAt.toISOString(),
  };
}
