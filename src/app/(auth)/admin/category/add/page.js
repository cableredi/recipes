import { getAuth } from "@/lib/auth/cookie";

import SubHeader from "@/components/headers/subHeader";
import CategoryForm from "@/components/category/categoryForm";

export default async function AddCategoryPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  const initialData = [];

  return (
    <>
      <SubHeader name="Add New Category" />

      <CategoryForm initialData={initialData} categoryAction="add" />
    </>
  );
}
