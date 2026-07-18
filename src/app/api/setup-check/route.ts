import { NextResponse } from "next/server";
import { runtimeAuthEnv, runtimeEnv } from "@/lib/runtime-env";

export const runtime = "nodejs";

/** Diagnostic route — shows which env vars the running container can see. */
export async function GET() {
  const auth = runtimeAuthEnv();
  const envKeys = Object.keys(process.env)
    .filter(
      (key) =>
        key.startsWith("AUTH") ||
        key.startsWith("NEXTAUTH") ||
        key.startsWith("DATABASE") ||
        key.startsWith("RAILWAY") ||
        key.startsWith("GITHUB"),
    )
    .sort();

  return NextResponse.json({
    hasAuthSecret: Boolean(auth.secret),
    authSecretLength: auth.secret?.length ?? 0,
    hasAuthUrl: Boolean(auth.url),
    hasGithubId: Boolean(auth.githubId),
    hasGithubSecret: Boolean(auth.githubSecret),
    hasDatabaseUrl: Boolean(runtimeEnv("DATABASE_URL")),
    nodeEnv: runtimeEnv("NODE_ENV") ?? "unknown",
    visibleEnvKeys: envKeys,
    totalEnvCount: Object.keys(process.env).length,
  });
}
