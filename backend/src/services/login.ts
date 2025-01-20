import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/schema";
import { createSession, generateSessionToken, verifyPassword } from "./auth";

export async function login(email: string, password: string) {
  try {
    // Query the database to find the user by email
    const user = await db
      .select({
        userId: users.id,
        passwordHash: users.passwordHash,
      })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();

    // Check if the user exists
    if (user.length === 0 || !user[0].passwordHash) {
      throw new Error("Invalid email or password");
    }

    // Destructure the user data
    const { userId, passwordHash } = user[0];

    // Verify the password
    const isPasswordValid = await verifyPassword(password, passwordHash);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    // Generate a session token
    const token = generateSessionToken();

    // Create a session in the database
    await createSession(token, userId);

    // Return the session or token to the caller
    return { message: "Login successful!" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
