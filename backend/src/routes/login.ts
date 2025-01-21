import { loginSchema } from "../lib/zod/auth";
import { Hono } from "hono";
import type { Context } from "hono";
import { login } from "../services/login";
import { ZodError } from "zod";

const loginHandler = new Hono()
  .get("/", (c: Context) => c.text("Hello World!"))
  .post("/", async (c: Context) => {
    try {
      const rawBody = await c.req.json();
      const { email, password } = loginSchema.parse(rawBody);
      

      const result = await login(email, password);
      return c.json({ message: result.message }, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error instanceof ZodError) {
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

export default loginHandler;
