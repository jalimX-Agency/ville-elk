import "server-only";
import { createHmac, timingSafeEqual, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db/client";

/**
 * The dashboard has one owner and no third-party sign-in, so a signed cookie
 * is the whole session story: the payload says who and until when, the HMAC
 * says the server issued it. Nothing here is readable or forgeable by the
 * browser, and revoking is a matter of rotating SESSION_SECRET.
 */
const COOKIE = "villa-elk-session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // two weeks

type Payload = { uid: string; exp: number; jti: string };

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value) throw new Error("SESSION_SECRET is not set");
  return value;
}

function sign(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("base64url");
}

function encode(payload: Payload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

function decode(token: string): Payload | null {
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = Buffer.from(sign(body));
  const given = Buffer.from(signature);
  // Compare in constant time; lengths must match before timingSafeEqual.
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as Payload;
    if (typeof payload.exp !== "number" || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function createSession(userId: string): Promise<void> {
  const token = encode({
    uid: userId,
    exp: Date.now() + MAX_AGE_SECONDS * 1000,
    jti: randomUUID(),
  });
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export type SessionUser = { id: string; name: string; email: string; role: string };

/** The signed-in user, or null. Every dashboard page and action calls this. */
export async function getSessionUser(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;

  const payload = decode(token);
  if (!payload) return null;

  // The cookie proves the session was issued; the row proves it still exists.
  const user = await db.user.findUnique({
    where: { id: payload.uid },
    select: { id: true, name: true, email: true, role: true },
  });
  return user;
}
