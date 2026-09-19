import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@/lib/db/client";

/**
 * The villa has one owner and no third-party sign-in, so the only provider is
 * email and password checked against the User table. Sessions are JSON Web
 * Tokens encrypted with AUTH_SECRET and stored in an httpOnly cookie; NextAuth
 * handles the CSRF token on its own endpoints.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // The dashboard lives at /admin, not at NextAuth's default /api/auth/signin.
  pages: { signIn: "/admin/login", error: "/admin/login" },
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email ?? "").trim().toLowerCase();
        const password = String(credentials?.password ?? "");
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        // Hash an empty comparison for unknown emails too, so a missing account
        // and a wrong password take the same time to answer.
        const ok = user
          ? await compare(password, user.passwordHash)
          : await compare(password, "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidinv");
        if (!user || !ok) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    // The token is the only thing carried between requests, so the role has to
    // ride along with it.
    async jwt({ token, user }) {
      if (user) token.role = (user as { role?: string }).role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as string) ?? "OWNER";
      }
      return session;
    },
  },
});
