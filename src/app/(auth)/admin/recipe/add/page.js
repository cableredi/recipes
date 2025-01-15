import { redirect } from "next/navigation";

import { getAuth } from "@/lib/auth/cookie";
import { getAllCategories } from "@/lib/categories";

import SubHeader from "@/components/headers/subHeader";
import AdminRecipeForm from "@/components/recipe/adminRecipeForm";

export default async function AddRecipePage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  const initialData = {
    recipe_id: "",
    recipe_name: "",
    recipe_category: "",
    recipe_image: "",
    instructions: [],
    ingredients: [],
  };

  const categories = await getAllCategories();

  return (
    <>
      <SubHeader name="Add New Recipe" />

      <AdminRecipeForm
        initialData={initialData}
        categories={categories}
        recipeAction="add"
      />
    </>
  );
}
