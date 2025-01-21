import type { InferSelectModel } from "drizzle-orm";
import type { sessions, users } from "../db/schema";

export type User = InferSelectModel<typeof users>;
export type Session = Omit<InferSelectModel<typeof sessions>, "createdAt">;
export type SessionValidationResult =
  | { session: Session; user: { id: number; email: string } }
  | { session: null; user: null };
