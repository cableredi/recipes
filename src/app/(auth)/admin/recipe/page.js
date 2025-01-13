import { getAuth } from "@/lib/auth/cookie";
import { getAllRecipes } from "@/lib/recipes";
import OrderedRecipesList from "@/components/recipe/orderedRecipesList";
import MainHeader from "@/components/headers/mainHeader";

export default async function RecipeAdminPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  let recipes = [];

  try {
    recipes = await getAllRecipes();
  } catch (error) {
    console.error("Error getting recipes:", error);
    return { error: error.message };
  }

  return (
    <section>
      <MainHeader name="Administration: Recipes" link="/admin/recipe/add" />

      <OrderedRecipesList recipes={recipes} admin={true} />
    </section>
  );
}
