"use client";

import { signIn } from "next-auth/react";

export function LoginPanel() {
  return (
    <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4 py-16 dark:bg-zinc-950">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-violet-600 dark:text-violet-400">
          Notes App
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Sign in to continue
        </h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Your notes are private and synced to your account across every device.
        </p>

        <button
          type="button"
          onClick={() => signIn("github", { callbackUrl: "/" })}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <span aria-hidden>🐙</span>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
