"use client";

import { useEffect, useMemo, useState } from "react";
import type { Note, NoteInput } from "@/types/note";
import { isNoteValid } from "@/types/note";

const STORAGE_KEY = "notes-app-notes";

function loadNotes(): Note[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Note[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveNotes(notes: Note[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNotes(loadNotes());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveNotes(notes);
  }, [notes, hydrated]);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

  const addNote = (input: NoteInput) => {
    if (!isNoteValid(input)) return false;

    const note: Note = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      content: input.content.trim(),
      updatedAt: new Date().toISOString(),
    };

    setNotes((current) => [note, ...current]);
    return true;
  };

  const updateNote = (id: string, input: NoteInput) => {
    if (!isNoteValid(input)) return false;

    setNotes((current) =>
      current.map((note) =>
        note.id === id
          ? {
              ...note,
              title: input.title.trim(),
              content: input.content.trim(),
              updatedAt: new Date().toISOString(),
            }
          : note,
      ),
    );
    return true;
  };

  const deleteNote = (id: string) => {
    setNotes((current) => current.filter((note) => note.id !== id));
  };

  return {
    notes: filteredNotes,
    totalCount: notes.length,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    hydrated,
  };
}
