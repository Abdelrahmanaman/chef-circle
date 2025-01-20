import z from "zod";

const envSchema = z.object({
  DB_HOST: z.string(),
  DB_PORT: z.string(),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DATABASE_URL: z.string(),
  PROD: z.string().transform((val) => val === "true" || val === "1"),
});

export const env = envSchema.parse(process.env);
