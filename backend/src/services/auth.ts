import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Session, SessionValidationResult } from "../types/auth";
import { db } from "../db/db";
import { sessions, users } from "../db/schema";
import { eq } from "drizzle-orm";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { Context } from "hono";
import { env } from "../../env";
import type { CookieOptions } from "hono/utils/cookie";

const SESSIONDURATION = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: SESSIONDURATION,
  };
  await db.insert(sessions).values(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));

  const result = await db
    .select({ user: users, session: sessions })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.id, sessionId));
  const { user, session } = result[0];
  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessions).where(eq(sessions.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = SESSIONDURATION;
    await db
      .update(sessions)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessions.id, session.id));
  }

  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.id, sessionId));
}

export function setSessionTokenCookie(
  c: Context,
  token: string,
  expiresAt: Date
): void {
  const cookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
    expires: expiresAt,
    secure: env.PROD,
  };

  setCookie(c, "session", token, cookieOptions);
}

export function deleteSessionTokenCookie(c: Context): void {
  const cookieOptions: CookieOptions = {
    path: "/",
    httpOnly: true,
    sameSite: "Lax" as const,
    secure: env.PROD,
  };

  deleteCookie(c, "session", cookieOptions);
}
