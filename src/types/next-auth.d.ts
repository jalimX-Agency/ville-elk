import type { DefaultSession } from "next-auth";

// The session carries who the person is and what they may do; both are set in
// the callbacks in src/auth.ts.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession["user"];
  }
}
