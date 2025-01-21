// lib/utils.ts
import type { z } from "zod";

// Utility function to parse JSON fields
export function parseJsonField<T>(data: unknown, schema: z.ZodSchema<T>): T {
  return schema.parse(data);
}
