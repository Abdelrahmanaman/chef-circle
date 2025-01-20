import { users } from "./schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../../env";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle({ client: pool });

// Function to insert a test user
async function insertTestUser() {
  try {
    // Insert a test user
    const testUser = await db
      .insert(users)
      .values({
        email: "test@example.com", // Unique email
        googleId: null, // No Google Auth for this user
        passwordHash: "hashed_password_here", // Replace with a real hash
        name: "Test User",
        profilePicture: "https://example.com/profile.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning(); // Return the inserted user

    console.log("Test user inserted:", testUser);
  } catch (error) {
    console.error("Error inserting test user:", error);
  }
}

// Run the function
insertTestUser();
