import { and, eq, gt, type InferSelectModel } from "drizzle-orm";
import { db } from "../db/db";
import { recipes } from "../db/schema";
import type { Recipe, RecipeQuery } from "../lib/zod/recipes";

export const createRecipe = async (recipeData: Recipe) => {
  const newRecipe = await db.insert(recipes).values(recipeData).returning();
  return newRecipe[0];
};

// Get a recipe by ID
export const getRecipeById = async (recipeId: number) => {
  const recipe = await db
    .select()
    .from(recipes)
    .where(eq(recipes.id, recipeId))
    .limit(1);
  return recipe[0];
};

// Update a recipe by ID
export const updateRecipe = async (
  recipeId: number,
  updateData: Partial<Recipe>
) => {
  const updatedRecipe = await db
    .update(recipes)
    .set(updateData)
    .where(eq(recipes.id, recipeId))
    .returning();
  return updatedRecipe[0];
};

// Delete a recipe by ID
export const deleteRecipe = async (recipeId: number) => {
  const deletedRecipe = await db
    .delete(recipes)
    .where(eq(recipes.id, recipeId))
    .returning();
  return deletedRecipe[0];
};

// List recipes with pagination and filtering
export async function listRecipes({
  limit = 20,
  cursor,
}: RecipeQuery): Promise<InferSelectModel<typeof recipes>[]> {
  const recipeList = await db
    .select()
    .from(recipes)
    .where(
      and(
        eq(recipes.isPublic, true), // Only fetch public recipes
        cursor ? gt(recipes.id, cursor) : undefined // Fetch items after the cursor
      )
    )
    .orderBy(recipes.id) // Order by ID for consistent pagination
    .limit(limit);

  return recipeList;
}
