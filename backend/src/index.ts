import { Hono } from "hono";
import loginHandler from "./routes/login";
import { serve } from "bun";
import registerHandler from "./routes/register";
import { logger } from "hono/logger";
import recipesHandler from "./routes/recipes";
const app = new Hono();

app.use(logger());

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.route("/login", loginHandler);
app.route("/register", registerHandler);
app.route("/recipes", recipesHandler);

// Serve the app on port 3001
serve({
  fetch: app.fetch, // Pass the Hono app's fetch handler
  port: 3001, // Specify the port
});

console.log("Server is running on http://localhost:3001");
