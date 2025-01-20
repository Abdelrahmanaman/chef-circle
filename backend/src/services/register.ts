import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { users } from "../db/schema";
import {
  createSession,
  generateHashPassword,
  generateSessionToken,
} from "./auth";

export async function register(email: string, name: string, password: string) {
  try {
    // Check if the email already exists
    const existingUser = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .execute();

    if (existingUser.length > 0) {
      throw new Error("This email already exists.");
    }

    // Generate hashed password
    const passwordHash = await generateHashPassword(password);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        email,
        name,
        passwordHash,
      })
      .returning({
        userId: users.id,
      });

    const { userId } = newUser[0];

    // Generate a session token
    const token = generateSessionToken();

    // Create a session in the database
    await createSession(token, userId);

    // Return success response
    return { message: "User created successfully!" };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message); // Provide specific error message
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
}
