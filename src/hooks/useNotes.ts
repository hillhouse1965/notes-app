"use client";

import { useEffect, useMemo, useState } from "react";
import type { Note, NoteInput } from "@/types/note";
import { isNoteValid } from "@/types/note";

async function fetchNotes(): Promise<Note[]> {
  const response = await fetch("/api/notes");
  if (!response.ok) {
    throw new Error("Failed to load notes");
  }
  return response.json();
}

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNotes()
      .then(setNotes)
      .catch(() => {
        setError("Could not load notes. Check that the database is connected.");
      })
      .finally(() => setHydrated(true));
  }, []);

  const filteredNotes = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return notes;

    return notes.filter(
      (note) =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query),
    );
  }, [notes, searchQuery]);

  const addNote = async (input: NoteInput): Promise<boolean> => {
    if (!isNoteValid(input)) return false;

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) return false;

      const note = (await response.json()) as Note;
      setNotes((current) => [note, ...current]);
      setError(null);
      return true;
    } catch {
      setError("Could not save the note. Please try again.");
      return false;
    }
  };

  const updateNote = async (id: string, input: NoteInput): Promise<boolean> => {
    if (!isNoteValid(input)) return false;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!response.ok) return false;

      const note = (await response.json()) as Note;
      setNotes((current) =>
        current.map((existing) => (existing.id === id ? note : existing)),
      );
      setError(null);
      return true;
    } catch {
      setError("Could not update the note. Please try again.");
      return false;
    }
  };

  const deleteNote = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) return;

      setNotes((current) => current.filter((note) => note.id !== id));
      setError(null);
    } catch {
      setError("Could not delete the note. Please try again.");
    }
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
    error,
  };
}
