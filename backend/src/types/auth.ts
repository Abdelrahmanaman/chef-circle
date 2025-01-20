import type { InferSelectModel } from "drizzle-orm";
import type { sessions, users } from "../db/schema";

export type User = InferSelectModel<typeof users>;
export type Session = Omit<InferSelectModel<typeof sessions>, "createdAt">;
export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
