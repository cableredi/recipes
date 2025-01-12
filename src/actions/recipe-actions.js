"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  addRecipe,
  editRecipe,
  deleteRecipe,
  editRecipeNotes,
} from "@/lib/recipes";

function capitalizeWords(str) {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function validateRecipe(recipe) {
  let errors = {};

  if (!recipe.name || recipe.name.trim() === "") {
    errors.recipe_name = "Recipe Name cannot be blank.";
  } else {
    recipe.name = capitalizeWords(recipe.name);
  }

  if (!recipe.category_id) {
    errors.category = "Please choose a category.";
  }

  if (recipe.ingredients.length > 0) {
    recipe.ingredients.map((ingred) => {
      if (!ingred.topic || ingred.topic.trim() === "") {
        errors.topic = "Ingredient category name cannot be blank .";
      } else {
        ingred.topic = capitalizeWords(ingred.topic);
      }

      if (ingred.items.length > 0) {
        ingred.items.map((item) => {
          if (!item.name || item.name.trim() === "") {
            errors.item_name = "Item name cannot be blank .";
          } else {
            item.name = capitalizeWords(item.name);
          }

          if (!item.amount || item.amount.trim() === "") {
            errors.item_amount = "Item amount cannot be blank .";
          }
        });
      } else {
        errors.items = "Please enter at least one item .";
      }
    });
  } else {
    errors.ingredients =
      "Please enter at least one ingredient topic and item .";
  }

  if (recipe.steps.length > 0) {
    recipe.steps.map((step) => {
      if (!step.instruction || step.instruction.trim() === "") {
        errors.instruction = "Instruction cannot be blank .";
      }
    });
  } else {
    errors.steps = "Please enter at least 1 instruction";
  }

  return errors;
}

export async function addRecipeAction(prevState, formData) {
  const recipe = {
    name: formData.get("recipe_name"),
    category_id: Number(formData.get("recipe_category")),
    ingredients: JSON.parse(formData.get("ingredients")),
    steps: JSON.parse(formData.get("steps")),
  };

  const errors = validateRecipe(recipe);

  if (Object.keys(errors).length != 0) {
    return { error: errors };
  }

  await addRecipe(recipe);

  revalidatePath("/admin/recipe");
  redirect("/admin/recipe");
}

export async function editRecipeAction(prevState, formData) {
  const recipe = {
    recipe_id: formData.get("recipe_id"),
    name: formData.get("recipe_name"),
    category_id: formData.get("recipe_category"),
    ingredients: JSON.parse(formData.get("ingredients")),
    steps: JSON.parse(formData.get("steps")),
  };

  const errors = validateRecipe(recipe);

  if (Object.keys(errors).length != 0) {
    return { error: errors };
  }

  await editRecipe(recipe);

  revalidatePath("/admin/recipe");
  redirect("/admin/recipe");
}

export async function deleteRecipeAction(recipe_id) {
  try {
    await deleteRecipe(recipe_id);
    revalidatePath("/admin/recipe");
  } catch (error) {
    console.error("Error deleting recipe:", error);
    return { error: error.message };
  }
}

export async function editRecipeNotesAction(prevState, formData) {
  const recipe = {
    recipe_id: formData.get("recipe_id"),
    note: formData.get("note"),
  };

  await editRecipeNotes(recipe);

  revalidatePath(`/admin/recipe/${recipe.recipe_id}`);
}
