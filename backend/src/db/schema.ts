import {
  pgTable,
  varchar,
  text,
  integer,
  boolean,
  timestamp,
  primaryKey,
  uuid,
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
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Sessions Table (for session storage)
export const sessions = pgTable("sessions", {
  id: varchar("id", {
    length: 255,
  }).primaryKey(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(), // Session expiration time
  createdAt: timestamp("created_at").defaultNow(), // Automatically set to current timestamp
});

// Recipes Table
export const recipes = pgTable("recipes", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => users.id),
  title: varchar("title").notNull(),
  description: text("description"),
  imageUrl: text("image_url").array(),
  servings: integer("servings").notNull(),
  prepTime: integer("prep_time").notNull(),
  cookTime: integer("cook_time").notNull(),
  totalTime: integer("total_time").notNull(),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Ingredients Table
export const ingredients = pgTable("ingredients", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  name: varchar("name").notNull(),
  quantity: integer("quantity").notNull(),
  unit: varchar("unit").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Instructions Table
export const instructions = pgTable("instructions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  stepNumber: integer("step_number").notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites Table (Many-to-Many: Users <-> Recipes)
export const favorites = pgTable(
  "favorites",
  {
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    recipeId: integer("recipe_id")
      .notNull()
      .references(() => recipes.id),
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
    .references(() => users.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
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
    .references(() => users.id),
  recipeId: integer("recipe_id")
    .notNull()
    .references(() => recipes.id),
  comment: text("comment").notNull(), // The comment text
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Subscriptions Table
export const subscriptions = pgTable("subscriptions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  subscriberId: integer("subscriber_id")
    .notNull()
    .references(() => users.id),
  creatorId: integer("creator_id")
    .notNull()
    .references(() => users.id),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  subscriptionEndDate: timestamp("subscription_end_date"),
  isActive: boolean("is_active").default(true),
});
