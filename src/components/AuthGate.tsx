"use client";

import { useSession } from "next-auth/react";
import { LoginPanel } from "@/components/LoginPanel";
import { NotesApp } from "@/components/NotesApp";

export function AuthGate() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-50 text-sm text-zinc-500 dark:bg-zinc-950">
        Checking your session...
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <LoginPanel />;
  }

  return <NotesApp />;
}
