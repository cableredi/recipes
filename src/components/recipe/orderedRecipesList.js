"use client";

import Link from "next/link";

import { FaHammer } from "react-icons/fa";
import { deleteRecipeAction } from "@/actions/recipe-actions";
import DeleteButton from "@/components/buttons/deleteButton";

import styles from "./orderedRecipesList.module.css";

export default function OrderedRecipesList({ recipes, admin = false }) {
  const groupdRecipes = recipes.reduce((recipe, obj) => {
    const k = obj.name.charAt(0).toUpperCase();

    recipe[k] = recipe[k] || [];
    recipe[k].push(obj);

    return recipe;
  }, {});

  const orderedRecipes = Object.keys(groupdRecipes)
    .sort()
    .reduce((obj, key) => {
      obj[key] = groupdRecipes[key];
      return obj;
    }, {});

  return (
    <div>
      {Object.keys(orderedRecipes).length === 0 && (
        <div>No recipes on file</div>
      )}

      {Object.values(orderedRecipes).map((item, index) => {
        return (
          <ul key={index} className={styles.bullet}>
            <h3>{item[0].name[0]}</h3>

            {item.map((item, itemIndex) => (
              <li key={itemIndex} data={item}>
                {admin && (
                  <div key={index} data={item} className={styles.flex}>
                    <div>
                      <Link href={`/admin/recipe/${item.recipe_id}`}>
                        <FaHammer />
                      </Link>
                    </div>

                    <div>
                      <DeleteButton
                        transaction={item.recipe_id}
                        formAction={deleteRecipeAction}
                        name="recipe"
                      />
                    </div>

                    <div>{item.name}</div>
                  </div>
                )}

                {!admin && (
                  <Link href={`/recipes/${item.recipe_id}`}>{item.name}</Link>
                )}
              </li>
            ))}
          </ul>
        );
      })}
    </div>
  );
}
