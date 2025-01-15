import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/cookie";

import { getAllCategories } from "@/lib/categories";
import { getRecipe } from "@/lib/recipes";

import SubHeader from "@/components/headers/subHeader";
import AdminRecipeForm from "@/components/recipe/adminRecipeForm";

export default async function EditRecipePage({ params }) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  const recipeParams = await params;
  const recipe_id = recipeParams.recipe;

  let recipe, categories;

  try {
    [recipe, categories] = await Promise.all([
      getRecipe(recipe_id),
      getAllCategories(),
    ]);
  } catch (error) {
    console.error("Error loading recipe data:", error);
    throw new Error("Failed to load recipe data. Please try again later.");
  }

  let initialData = {
    recipe_id: recipe.recipe_id,
    recipe_name: recipe.name,
    recipe_category: recipe.category_id,
    instructions: recipe.instructions,
    ingredients: recipe.ingredients,
  };

  return (
    <>
      <SubHeader name="Edit Recipe" />

      <AdminRecipeForm
        initialData={initialData}
        categories={categories}
        recipeAction="edit"
      />
    </>
  );
}
