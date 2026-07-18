import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

function requiredEnv(name: string, value: string | undefined): string {
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value.trim();
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: requiredEnv(
    "AUTH_SECRET",
    process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  ),
  providers: [
    GitHub({
      clientId: requiredEnv("AUTH_GITHUB_ID", process.env.AUTH_GITHUB_ID),
      clientSecret: requiredEnv(
        "AUTH_GITHUB_SECRET",
        process.env.AUTH_GITHUB_SECRET,
      ),
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
