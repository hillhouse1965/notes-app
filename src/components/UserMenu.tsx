"use client";

import { signOut, useSession } from "next-auth/react";
import { ThemeToggle } from "@/components/ThemeToggle";

export function UserMenu() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? session?.user?.email ?? "Signed in";

  return (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <div className="hidden text-right sm:block">
        <p className="max-w-[160px] truncate text-xs font-medium text-zinc-700 dark:text-zinc-200">
          {name}
        </p>
      </div>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/" })}
        className="rounded-xl border border-zinc-200 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
      >
        Sign out
      </button>
    </div>
  );
}
