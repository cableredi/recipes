import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth/cookie";
import { getAllRecipes } from "@/lib/recipes";
import SubHeader from "@/components/headers/subHeader";
import OrderedRecipesList from "@/components/recipe/orderedRecipesList";

export default async function RecipesPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  let recipes;

  try {
    recipes = await getAllRecipes();
  } catch (error) {
    console.error("Error getting recipes:", error);
    return { error: error.message };
  }

  return (
    <section>
      <SubHeader name="Recipes" />

      <OrderedRecipesList recipes={recipes} />
    </section>
  );
}
