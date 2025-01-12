import { getAuth } from "@/lib/auth/cookie";
import { getCategory } from "@/lib/categories";

import CategoryForm from "@/components/category/categoryForm";

export default async function EditCategoryPage({ params }) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  const categoryParams = await params;
  const categoryID = categoryParams.category;

  const categoryData = await getCategory(categoryID);

  return (
    <section>
      <header className="header">
        <h2>Edit Category</h2>
      </header>

      <CategoryForm initialData={categoryData} categoryAction="edit" />
    </section>
  );
}
