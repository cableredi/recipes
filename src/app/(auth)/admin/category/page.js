import Link from "next/link";
import { redirect } from "next/navigation";
import { FaHammer } from "react-icons/fa";

import { getAuth } from "@/lib/auth/cookie";
import { getAllCategories, getRecipeCount } from "@/lib/categories";
import { deleteCategoryAction } from "@/actions/category-actions";

import MainHeader from "@/components/headers/mainHeader";
import DeleteButton from "@/components/buttons/deleteButton";

import styles from "./page.module.css";

export default async function CategoryPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  let categories, categoryCounts;

  try {
    [categories, categoryCounts] = await Promise.all([
      getAllCategories(),
      getRecipeCount(),
    ]);
  } catch (error) {
    console.error("Error getting categories:", error);
    return { error: error.message };
  }

  let orderedCategories;

  const groupdCategories = categories.reduce((category, obj) => {
    const k = obj.name.charAt(0).toUpperCase();

    category[k] = category[k] || [];
    category[k].push(obj);

    return category;
  }, {});

  orderedCategories = Object.keys(groupdCategories)
    .sort()
    .reduce((obj, key) => {
      obj[key] = groupdCategories[key];
      return obj;
    }, {});

  return (
    <section>
      <MainHeader
        name="Administration: Categories"
        link="/admin/category/add"
      />

      <div>
        {Object.keys(orderedCategories).length === 0 && (
          <div>No categories on file</div>
        )}

        {Object.values(orderedCategories).map((item, index) => {
          return (
            <ul key={index} className={styles.bullet}>
              <h3>{item[0].name[0]}</h3>

              {item.map((item, itemIndex) => (
                <li key={itemIndex} data={item}>
                  <div key={index} data={item} className={styles.flex}>
                    <div>
                      <Link href={`/admin/category/${item.category_id}`}>
                        <FaHammer />
                      </Link>
                    </div>

                    {categoryCounts.find(
                      (cat) =>
                        cat.category_id === item.category_id &&
                        cat._count.recipes === 0
                    ) ? (
                      <DeleteButton
                        transaction={item.category_id}
                        formAction={deleteCategoryAction}
                        name="category"
                      />
                    ) : (
                      <div className={styles.spacer}></div>
                    )}

                    <div>{item.name}</div>
                  </div>
                </li>
              ))}
            </ul>
          );
        })}
      </div>
    </section>
  );
}
