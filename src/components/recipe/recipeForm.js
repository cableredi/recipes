"use client";

import React from "react";

import { useActionState, useState, useEffect } from "react";
import { editRecipeNotesAction } from "@/actions/recipe-actions";
import EditorSubmitButton from "@/components/buttons/editorSubmitButton";
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
            <h2>Ingredients</h2>

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
        </div>

        <div className={styles.gridNotes}>
          <h2>Notes</h2>

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

                <EditorSubmitButton btnPending="Saving" btnName="Save" />
              </div>
            </form>
          </div>
        </div>

        <div className={styles.gridInstructions}>
          <div className={styles.instructions}>
            <h2>Instructions</h2>

            <div>
              <table>
                <tbody>
                  {recipeData.instructions.map((instruct, instructIndex) => (
                    <React.Fragment key={instructIndex}>
                      <tr>
                        <td colSpan={4} className={styles.topic}>
                          {instruct.topic}
                        </td>
                      </tr>

                      <tr>
                        <td className={styles.tableSpace}></td>
                        <td
                          className={`${styles.tableHeaders}`}
                        >
                          Step
                        </td>
                        <td
                          className={`${styles.tableHeaders}`}
                        >
                          Instruction
                        </td>
                      </tr>

                      {instruct.steps.map((step, stepIndex) => (
                        <tr key={stepIndex}>
                          <td></td>
                          <td>{step.step_number}</td>
                          <td>{step.instruction}</td>
                        </tr>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
