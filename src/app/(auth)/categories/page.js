import { redirect } from "next/navigation";
import Link from "next/link";

import { getAuth } from "@/lib/auth/cookie";
import { getAllRecipesGroupedByCategory } from "@/lib/recipes";

import SubHeader from "@/components/headers/subHeader";

import styles from "./page.module.css";

export default async function CategoriesPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  let recipes;

  try {
    recipes = await getAllRecipesGroupedByCategory();
  } catch (error) {
    console.error("Error getting all recipes data:", error);
    throw new Error("Failed to load recipe data. Please try again later.");
  }

  const categorizedRecipes = recipes.reduce((acc, recipe) => {
    const categoryName = recipe.category.name;

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    acc[categoryName].push({
      recipe_id: recipe.recipe_id,
      name: recipe.name,
    });

    return acc;
  }, {});

  // Sort recipes within each category by name
  for (const category in categorizedRecipes) {
    categorizedRecipes[category].sort((a, b) => {
      return a.name.localeCompare(b.name);
    });
  }

  // Convert object to an array, sort by category names, and return it as an ordered object
  const sortedCategorizedRecipes = Object.keys(categorizedRecipes)
    .sort((a, b) => a.localeCompare(b)) // Sort category names alphabetically
    .reduce((acc, key) => {
      acc[key] = categorizedRecipes[key];
      return acc;
    }, {});

  return (
    <section>
      <SubHeader name="Recipes by Categories" />

      <div>
        {Object.keys(sortedCategorizedRecipes).map((key) => (
          <div key={key} className={styles.bullet}>
            <h3>{key}</h3>

            <ul>
              {sortedCategorizedRecipes[key].map((obj) => (
                <li key={obj.recipe_id}>
                  <Link href={`/recipes/${obj.recipe_id}`}>{obj.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
