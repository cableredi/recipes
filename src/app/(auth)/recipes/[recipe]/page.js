import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth/cookie";
import { getRecipe } from "@/lib/recipes";

import SubHeader from "@/components/headers/subHeader";
import Recipe from "@/components/recipe/recipe";
import BackButton from "@/components/buttons/backButton";

import styles from "./page.module.css";

export default async function RecipePage({ params }) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  const recipeParams = await params;
  const recipe_id = recipeParams.recipe;

  let recipeData;

  try {
    recipeData = await getRecipe(recipe_id);
  } catch (error) {
    console.log("Error getting recipe:", error);
  }

  return (
    <div className={styles.recipe}>
      <SubHeader name={recipeData.name} />

      <BackButton />

      <Recipe recipeData={recipeData} />
    </div>
  );
}
