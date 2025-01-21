import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  jsonb,
} from "drizzle-orm/pg-core";

// Users Table
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(), // Auto-incrementing primary key
  email: varchar("email").unique().notNull(),
  googleId: varchar("google_id").unique(),
  passwordHash: varchar("password_hash"),
  name: varchar("name").notNull(),
  profilePicture: varchar("profile_picture"),
  resetPasswordToken: varchar("reset_password_token"), // Token for password reset
  resetPasswordExpires: timestamp("reset_password_expires"), // Expiration time for reset token
  unitSystem: varchar("unit_system").default("metric"), // 'metric' or 'imperial'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions Table (for session storage)
export const sessions = pgTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(), // Session ID
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete sessions when user is deleted
  expiresAt: timestamp("expires_at").notNull(), // Session expiration time
  createdAt: timestamp("created_at").defaultNow(), // Automatically set to current timestamp
});

// Recipes Table
export const recipes = pgTable("recipes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer("creator_id").references(() => users.id, {
    onDelete: "set null",
  }), // Set creatorId to null when user is deleted
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").array(), // Array of image URLs
  servings: integer("servings").notNull(),
  totalTime: integer("total_time").notNull(), // In minutes
  ingredients: jsonb("ingredients").notNull(), // JSON array of ingredients
  instructions: jsonb("instructions").notNull(), // JSON array of instructions
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites Table (Many-to-Many: Users <-> Recipes)
export const favorites = pgTable(
  "favorites",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Delete favorites when user is deleted
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id, { onDelete: "cascade" }), // Delete favorites when recipe is deleted
    favoritedAt: timestamp("favorited_at").defaultNow(),
  },
  (table) => {
    return [
      primaryKey({ columns: [table.userId, table.recipeId] }), // Composite primary key
    ];
  }
);

// Reviews Table
export const reviews = pgTable("reviews", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete reviews when user is deleted
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }), // Delete reviews when recipe is deleted
  rating: integer("rating").notNull(), // Rating out of 5
  comment: text("comment"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Comments Table
export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete comments when user is deleted
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id, { onDelete: "cascade" }), // Delete comments when recipe is deleted
  comment: text("comment").notNull(), // The comment text
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions Table
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subscriberId: integer("subscriber_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete subscriptions when subscriber is deleted
  creatorId: integer("creator_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Delete subscriptions when creator is deleted
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  isActive: boolean("is_active").default(true),
});
