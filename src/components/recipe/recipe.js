import React from "react";

import RecipeForm from "./recipeForm";

export default async function Recipe({ recipeData }) {
  const initialData = {
    recipe_id: recipeData.recipe_id,
    note: recipeData.note,
  };

  return <RecipeForm initialData={initialData} recipeData={recipeData} />;
}
