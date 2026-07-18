import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Temporary diagnostic route — shows which auth env vars Railway can see (not their values). */
export async function GET() {
  const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  return NextResponse.json({
    hasAuthSecret: Boolean(authSecret && authSecret.length > 0),
    authSecretLength: authSecret?.length ?? 0,
    hasAuthUrl: Boolean(process.env.AUTH_URL ?? process.env.NEXTAUTH_URL),
    hasGithubId: Boolean(process.env.AUTH_GITHUB_ID),
    hasGithubSecret: Boolean(process.env.AUTH_GITHUB_SECRET),
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    nodeEnv: process.env.NODE_ENV ?? "unknown",
  });
}
