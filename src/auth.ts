import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const authSecret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
const githubClientId =
  process.env.AUTH_GITHUB_ID ?? process.env.GITHUB_ID ?? process.env.GITHUB_CLIENT_ID;
const githubClientSecret =
  process.env.AUTH_GITHUB_SECRET ??
  process.env.GITHUB_SECRET ??
  process.env.GITHUB_CLIENT_SECRET;

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: authSecret,
  providers: [
    GitHub({
      clientId: githubClientId,
      clientSecret: githubClientSecret,
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
});
