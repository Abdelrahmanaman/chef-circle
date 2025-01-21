import { eq } from "drizzle-orm";
import { sessions } from "../db/schema";
import { db } from "../db/db";

export async function logout(userId: number) {
  // Delete the session from the database
  await db.delete(sessions).where(eq(sessions.userId, userId));
}
