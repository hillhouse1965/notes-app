/**
 * Read environment variables at runtime using dynamic keys.
 * Next.js can inline `process.env.AUTH_SECRET` at build time as empty
 * when vars aren't present during `next build`. Bracket access avoids that.
 */
export function runtimeEnv(name: string): string | undefined {
  const value = process.env[name];
  if (!value || value.trim().length === 0) return undefined;
  return value.trim();
}

export function runtimeAuthEnv(): {
  secret: string | undefined;
  url: string | undefined;
  githubId: string | undefined;
  githubSecret: string | undefined;
} {
  return {
    secret: runtimeEnv("AUTH_SECRET") ?? runtimeEnv("NEXTAUTH_SECRET"),
    url: runtimeEnv("AUTH_URL") ?? runtimeEnv("NEXTAUTH_URL"),
    githubId: runtimeEnv("AUTH_GITHUB_ID"),
    githubSecret: runtimeEnv("AUTH_GITHUB_SECRET"),
  };
}
