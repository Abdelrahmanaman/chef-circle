import { signUpSchema } from "./../lib/validation";
import { Hono } from "hono";
import { register } from "../services/register";
import { ZodError } from "zod";

const registerHandler = new Hono();

registerHandler.post("/", async (c) => {
  try {
    const rawBody = await c.req.json();

    const { email, name, password } = signUpSchema.parse(rawBody);

    const result = await register(email, name, password);
    return c.json({ message: result.message }, 201);
  } catch (error) {
    if (error instanceof Error) {
      if (error instanceof ZodError) {
        // Handle Zod validation errors
        const errors = error.errors.map((err) => ({
          message: err.message,
        }));
        return c.json(errors[0], 400);
      }
      return c.json({ error: error.message }, 400); // Return 400 for validation errors
    } else {
      return c.json({ error: "An unexpected error occurred." }, 500);
    }
  }
});

export default registerHandler;
