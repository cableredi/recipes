"use client";

import React from "react";

import { useActionState, useState, useEffect } from "react";
import { editRecipeNotesAction } from "@/actions/recipe-actions";
import EditorFormSubmit from "@/components/buttons/editorFormSubmit";
import Tiptap from "../editor/editor";

import styles from "./recipeForm.module.css";

export default function RecipeForm({ initialData, recipeData }) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(editRecipeNotesAction, {
    errors: "",
    ...initialData,
  });

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleEditorChange = (note) => {
    setFormData({
      ...formData,
      note: note,
    });
  };

  return (
    <>
      <div className={styles.grid}>
        <div className={styles.gridRecipe}>
          <h3>Category: {recipeData.category.name}</h3>

          <div>
            <h3>Ingredients</h3>

            <table>
              <tbody>
                {recipeData.ingredients.map((ingred, ingredIndex) => (
                  <React.Fragment key={ingredIndex}>
                    <tr>
                      <td colSpan={4} className={styles.topic}>
                        {ingred.topic}
                      </td>
                    </tr>

                    <tr>
                      <td className={styles.tableSpace}></td>
                      <td
                        className={`${styles.tableHeaders} ${styles.ingredient}`}
                      >
                        Ingredient
                      </td>
                      <td className={`${styles.tableHeaders} ${styles.amount}`}>
                        Amount
                      </td>
                    </tr>

                    {ingred.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td></td>
                        <td>{item.name}</td>
                        <td>{item.amount}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          <div className={styles.instructions}>
            <h3>Instructions</h3>

            {/* <table>
              <tbody>
                {recipeData.steps.map((step) => (
                  <tr key={step.step_id}>
                    <td className={styles.tableHeaders}>{step.step_number}.</td>
                    <td>{step.instruction}</td>
                  </tr>
                ))}
              </tbody>
            </table> */}

            <div>
              {recipeData.steps.map((step) => (
                <div className={styles.instructionGrid} key={step.step_id}>
                  <h4 className={styles.gridStep}>{step.step_number}.</h4>
                  <div className={styles.gridInstruction}>
                    {step.instruction}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.gridNotes}>
          <h3>Notes</h3>

          <div>
            <form action={formAction} className={styles.recipeForm}>
              <Tiptap
                editorContent={formData.note}
                onChange={(note) => handleEditorChange(note)}
              />

              <input type="hidden" name="note" value={formData.note || ""} />

              <div>
                <input
                  type="hidden"
                  id="recipe_id"
                  name="recipe_id"
                  value={formData.recipe_id || ""}
                />

                <EditorFormSubmit btnPending="Saving" btnName="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
