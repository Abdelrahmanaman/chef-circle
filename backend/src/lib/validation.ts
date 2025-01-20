import { z } from "zod";

const passwordRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

const strongPasswordRegex = z.string().regex(passwordRegex, {
  message: "Password must be at least 8 characters long",
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: strongPasswordRegex,
});

export type LoginRequest = z.infer<typeof loginSchema>;

export const signUpSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: strongPasswordRegex,
});

export type RegisterRequest = z.infer<typeof signUpSchema>;
