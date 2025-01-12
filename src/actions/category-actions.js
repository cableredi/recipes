"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { addCategory, updateCategory, deleteCategory } from "@/lib/categories";

export async function addCategoryAction(prevState, formData) {
  const category = {
    name: formData.get("name"),
  };

  let errors = {};

  if (!category.name || category.name.trim() === "") {
    errors.name = "Category Name cannot be blank.";
  }

  if (Object.keys(errors).length != 0) {
    return { error: errors };
  }

  await addCategory(category.name);

  revalidatePath("/admin/category");
  redirect("/admin/category");
}

export async function editCategoryAction(prevState, formData) {
  const category = {
    name: formData.get("name"),
    category_id: formData.get("categoryID"),
  };

  let errors = {};

  if (!category.name || category.name.trim() === "") {
    errors.name = "Category Name cannot be blank.";
  }

  if (
    !category.category_id ||
    category.category_id.trim() === "" ||
    !Number(category.category_id)
  ) {
    errors.name = "Something went wrong.";
  }

  if (Object.keys(errors).length != 0) {
    return { error: errors };
  }

  await updateCategory(category);

  revalidatePath("/admin/category");
  redirect("/admin/category");
}

export async function deleteCategoryAction(category_id) {
  try {
    await deleteCategory(category_id);

    revalidatePath("/admin/category");
  } catch (error) {
    console.error("Error deleting category:", error);

    return { error: error.message };
  }
}
