import type { Context, Next } from "hono";
import { getCookie } from "hono/cookie";
import { validateSessionToken } from "../services/auth";

export async function authenticationMiddleware(c: Context, next: Next) {
  try {
    const token = getCookie(c, "session");
    if (!token) {
      return c.json({ error: "Unauthorized: No session token provided." }, 401);
    }
    const { session, user } = await validateSessionToken(token);
    if (!session || !user) {
      return c.json({ error: "Unauthorized: Invalid session token." }, 401);
    }
    c.set("user", user);
    c.set("session", session);
    await next();
  } catch (error) {
    return c.json({ error: "Internal server error." }, 500);
  }
}
