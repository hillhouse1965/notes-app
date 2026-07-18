import NextAuth, { type NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { runtimeAuthEnv } from "@/lib/runtime-env";

function createAuthConfig(): NextAuthConfig {
  const { secret, githubId, githubSecret } = runtimeAuthEnv();

  return {
    adapter: PrismaAdapter(prisma),
    secret: secret ?? "build-time-placeholder",
    providers: [
      GitHub({
        clientId: githubId ?? "build-time-placeholder",
        clientSecret: githubSecret ?? "build-time-placeholder",
      }),
    ],
    trustHost: true,
    pages: {
      signIn: "/",
    },
    callbacks: {
      session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
        }
        return session;
      },
    },
  };
}

const nextAuth = NextAuth(createAuthConfig);

export const handlers = nextAuth.handlers;
export const auth = nextAuth.auth;
export const signIn = nextAuth.signIn;
export const signOut = nextAuth.signOut;
