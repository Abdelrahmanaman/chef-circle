import { Hono, type Context } from "hono";
import { createRecipe, listRecipes } from "../services/recipes";
import { createRecipeSchema } from "../lib/zod/recipes";
import { ZodError } from "zod";

const recipesHandler = new Hono()
  .get("/", async (c: Context) => {
    try {
      const recipes = await listRecipes({ limit: 20 });
      if (recipes.length === 0) {
        return c.json({ message: "No recipes found." }, 404);
      }
      return c.json(recipes);
    } catch (error) {
      if (error instanceof Error) {
        return c.json({ error: error.message }, 500);
      }
      return c.json({ error: "An unexpected error occurred." }, 500);
    }
  })
  .post("/", async (c: Context) => {
    try {
      const reqBody = await c.req.json();
      const recipeData = createRecipeSchema.parse(reqBody);
      const newRecipe = await createRecipe(recipeData);
      return c.json(newRecipe, 201);
    } catch (error) {
      if (error instanceof Error) {
        // Handle Zod validation errors
        if (error instanceof ZodError) {
          const errors = error.errors.map((err) => ({
            message: err.message,
          }));
          return c.json(errors[0], 400);
        }
        return c.json({ error: error.message }, 400);
      } else {
        return c.json({ error: "An unexpected error occurred." }, 500);
      }
    }
  });

export default recipesHandler;
