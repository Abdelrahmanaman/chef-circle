import { z } from "zod";

const units = ["g", "kg", "ml", "L", "tsp", "tbsp", "cup"] as const;

// Zod schema for an ingredient
const ingredientSchema = z.object({
  name: z
    .string({
      required_error: "Ingredient name is required", // Custom error message for missing name
      invalid_type_error: "Ingredient name must be a string", // Custom error message for invalid type
    })
    .min(1, "Ingredient name cannot be empty"), // Custom error message for empty name,
  quantity: z
    .number({
      required_error: "Quantity is required", // Custom error message for missing quantity
      invalid_type_error: "Quantity must be a number", // Custom error message for invalid type
    })
    .min(0, "Quantity must be a positive number"),
  unit: z.enum(units, {
    required_error: "Unit is required", // Unit is required
    invalid_type_error: `Unit must be one of: ${units.join(", ")}`,
  }),
});

// Zod schema for creating a recipe
export const createRecipeSchema = z.object({
  creatorId: z.number(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  imageUrl: z.array(z.string().url()).optional(),
  servings: z.number().min(1, "Servings must be at least 1"),
  totalTime: z.number().min(1, "Total time must be at least 1 minute"),
  ingredients: z
    .array(ingredientSchema)
    .min(1, "At least one ingredient is required"),
  instructions: z
    .array(z.string())
    .min(1, "At least one instruction is required"),
  isPublic: z.boolean().default(false),
});

// Zod schema for updating a recipe
export const updateRecipeSchema = createRecipeSchema.partial();

// Zod schema for recipe ID
export const recipeIdSchema = z.object({
  id: z.number().min(1, "Recipe ID must be a positive number"),
});

// Zod schema for query parameters (e.g., pagination, filtering)
export const cursorPaginationSchema = z.object({
  cursor: z.number().min(1).optional(), // ID of the last item received
  limit: z.number().min(1).max(50).default(20), // Default to 20 items per request
});

export type Recipe = z.infer<typeof createRecipeSchema>;
export type RecipeQuery = z.infer<typeof cursorPaginationSchema>;
export type Unit = (typeof units)[number];
