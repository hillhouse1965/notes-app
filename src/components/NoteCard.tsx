"use client";

import { useState } from "react";
import type { Note } from "@/types/note";
import { NoteForm } from "@/components/NoteForm";

interface NoteCardProps {
  note: Note;
  onUpdate: (id: string, input: { title: string; content: string }) => boolean | Promise<boolean>;
  onDelete: (id: string) => void;
}

function formatDate(isoDate: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(isoDate));
}

export function NoteCard({ note, onUpdate, onDelete }: NoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  if (isEditing) {
    return (
      <NoteForm
        submitLabel="Save changes"
        initialValues={{ title: note.title, content: note.content }}
        onSubmit={async (input) => {
          const saved = await onUpdate(note.id, input);
          if (saved) setIsEditing(false);
          return saved;
        }}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <article className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-2">
          <h2 className="truncate text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {note.title}
          </h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-zinc-600 dark:text-zinc-300">
            {note.content}
          </p>
          <p className="text-xs text-zinc-400">Updated {formatDate(note.updatedAt)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="rounded-lg border border-zinc-200 px-3 py-1.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(note.id)}
          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 dark:hover:bg-red-950/40"
        >
          Delete
        </button>
      </div>
    </article>
  );
}
