"use client";

import { NoteCard } from "@/components/NoteCard";
import { NoteForm } from "@/components/NoteForm";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useNotes } from "@/hooks/useNotes";

export function NotesApp() {
  const {
    notes,
    totalCount,
    searchQuery,
    setSearchQuery,
    addNote,
    updateNote,
    deleteNote,
    hydrated,
  } = useNotes();

  return (
    <div className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
              Notes App
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Your ideas, organised
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
              Create, edit, and search notes. Everything is saved locally in your browser for now.
            </p>
          </div>
          <ThemeToggle />
        </header>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        <section aria-label="Create note">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500">
            New note
          </h2>
          <NoteForm submitLabel="Add note" onSubmit={addNote} />
        </section>

        <section aria-label="Notes list" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Your notes
            </h2>
            <span className="text-xs text-zinc-400">
              {hydrated ? `${totalCount} saved` : "Loading..."}
            </span>
          </div>

          {!hydrated ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
              Loading your notes...
            </div>
          ) : notes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
              {searchQuery.trim()
                ? "No notes match your search."
                : "No notes yet. Create your first one above."}
            </div>
          ) : (
            notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onUpdate={updateNote}
                onDelete={deleteNote}
              />
            ))
          )}
        </section>
      </div>
    </div>
  );
}
