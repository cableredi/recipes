"use client";

import React from "react";
import { useActionState, useState, useEffect } from "react";

import { IoTrashOutline } from "react-icons/io5";

import { addRecipeAction, editRecipeAction } from "@/actions/recipe-actions";

import FormSubmitButton from "@/components/buttons/formSubmitButton";

import styles from "./adminRecipeForm.module.css";

export default function AdminRecipeForm({
  initialData,
  categories,
  recipeAction,
}) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(
    recipeAction === "edit" ? editRecipeAction : addRecipeAction,
    {
      errors: "",
      ...initialData,
    }
  );

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add a new Step
  const addStep = () => {
    const newStep = {
      step_id: "",
      instruction: "",
    };

    setFormData({
      ...formData,
      steps: [...formData.steps, newStep],
    });
  };

  // Remove a step
  const removeStep = (index) => {
    const updatedSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: updatedSteps });
  };

  // Add a new Ingredient
  const addIngredient = () => {
    const newIngredient = {
      ingredient_id: "",
      topic: "",
      items: [],
    };

    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, newIngredient],
    });
  };

  // Add a new Item under the selected Ingredient
  const addItem = (ingredientIndex) => {
    const newItem = {
      item_id: "",
      name: "",
      amount: "",
    };

    const updatedIngredients = formData.ingredients.map((ingredient, index) => {
      if (index === ingredientIndex) {
        return {
          ...ingredient,
          items: [...ingredient.items, newItem],
        };
      }
      return ingredient;
    });

    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  // Remove an Item from a specific Ingredient
  const removeItem = (ingredientIndex, itemIndex) => {
    const updatedIngredients = formData.ingredients.map((ingredient, index) => {
      if (index === ingredientIndex) {
        return {
          ...ingredient,
          items: ingredient.items.filter((_, i) => i !== itemIndex),
        };
      }
      return ingredient;
    });

    setFormData({
      ...formData,
      ingredients: updatedIngredients,
    });
  };

  // Remove an Ingredient
  const removeIngredient = (index) => {
    const updatedIngredients = formData.ingredients.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  console.log("FORMDATA");
  console.log(formData);

  return (
    <form action={formAction} className={styles.recipeForm}>
      <h3>New Recipe</h3>

      <div>
        <label htmlFor="recipe_name">Recipe Name</label>
        <input
          type="text"
          id="recipe_name"
          name="recipe_name"
          value={formData.recipe_name || ""}
          onChange={handleChange}
        />
        {data.error?.recipe_name && (
          <p className="errors">{data.error.recipe_name}</p>
        )}
      </div>

      <div>
        <label htmlFor="recipe_category">Category</label>
        <select
          id="recipe_category"
          name="recipe_category"
          value={formData.recipe_category}
          onChange={handleChange}
        >
          {categories.map((cat) => (
            <option key={cat.category_id} value={cat.category_id}>
              {cat.name}
            </option>
          ))}
        </select>
        {data.error?.category && (
          <p className="errors">{data.error.category}</p>
        )}
      </div>

      <div>
        <h3>Ingredients</h3>

        <div>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
              </tr>
            </thead>

            <tbody>
              {formData.ingredients?.map((ingredient, ingredientIndex) => (
                <React.Fragment key={ingredientIndex}>
                  <tr>
                    <td>
                      <input
                        type="hidden"
                        id="ingredientID"
                        name="ingredientID"
                        value={ingredient.ingredient_id || ""}
                      />

                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredientIndex)}
                        className="plainButtonTrash"
                      >
                        <IoTrashOutline />
                      </button>
                    </td>

                    <td>
                      <input
                        type="text"
                        id="topic"
                        name="topic"
                        value={ingredient.topic || ""}
                        onChange={(e) => {
                          const updatedIngredients = formData.ingredients.map(
                            (ing, index) =>
                              index === ingredientIndex
                                ? { ...ing, topic: e.target.value }
                                : ing
                          );
                          setFormData({
                            ...formData,
                            ingredients: updatedIngredients,
                          });
                        }}
                      />
                    </td>
                  </tr>

                  {data.error?.topic && (
                    <tr>
                      <td colSpan={2} className="errors">
                        {data.error.topic}
                      </td>
                    </tr>
                  )}

                  {data.error?.ingredients && (
                    <tr>
                      <td colSpan={2} className="errors">
                        {data.error.ingredients}
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td></td>

                    <td>
                      <table>
                        <thead>
                          <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          {ingredient.items.map((item, itemIndex) => (
                            <React.Fragment key={itemIndex}>
                              <tr>
                                <td>
                                  <input
                                    type="hidden"
                                    id="item_id"
                                    name="item_id"
                                    value={item.item_id || ""}
                                  />

                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeItem(ingredientIndex, itemIndex)
                                    }
                                    className="plainButtonTrash"
                                  >
                                    <IoTrashOutline />
                                  </button>
                                </td>

                                <td>
                                  <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={item.name || ""}
                                    onChange={(e) => {
                                      const updatedIngredients =
                                        formData.ingredients.map((ing, index) =>
                                          index === ingredientIndex
                                            ? {
                                                ...ing,
                                                items: ing.items.map((i, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...i,
                                                        name: e.target.value,
                                                      }
                                                    : i
                                                ),
                                              }
                                            : ing
                                        );
                                      setFormData({
                                        ...formData,
                                        ingredients: updatedIngredients,
                                      });
                                    }}
                                  />
                                </td>

                                <td>
                                  <input
                                    type="text"
                                    id="amount"
                                    name="amount"
                                    value={item.amount || ""}
                                    onChange={(e) => {
                                      const updatedIngredients =
                                        formData.ingredients.map((ing, index) =>
                                          index === ingredientIndex
                                            ? {
                                                ...ing,
                                                items: ing.items.map((i, idx) =>
                                                  idx === itemIndex
                                                    ? {
                                                        ...i,
                                                        amount: e.target.value,
                                                      }
                                                    : i
                                                ),
                                              }
                                            : ing
                                        );
                                      setFormData({
                                        ...formData,
                                        ingredients: updatedIngredients,
                                      });
                                    }}
                                  />
                                </td>
                              </tr>
                            </React.Fragment>
                          ))}

                          <tr>
                            <td></td>
                            <td>
                              <button
                                type="button"
                                onClick={() => addItem(ingredientIndex)}
                              >
                                Add Item
                              </button>
                            </td>
                          </tr>

                          {data.error?.item_name && (
                            <tr>
                              <td colSpan={2} className="errors">
                                {data.error.item_name}
                              </td>
                            </tr>
                          )}

                          {data.error?.item_amount && (
                            <tr>
                              <td colSpan={2} className="errors">
                                {data.error.item_amount}
                              </td>
                            </tr>
                          )}

                          {data.error?.items && (
                            <tr>
                              <td colSpan={2} className="errors">
                                {data.error.items}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </React.Fragment>
              ))}

              <tr>
                <td colSpan={2}>
                  <button type="button" onClick={addIngredient}>
                    Add New Ingredient Category
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          {data.error?.ingredients && (
            <div className="errors">{data.error.ingredients}</div>
          )}
        </div>
      </div>

      <div>
        <h3>Instructions</h3>

        <div className={styles.flex}>
          <div>
            <div>
              {formData.steps?.map((step, index) => (
                <div key={index} className={styles.flex}>
                  <input
                    type="hidden"
                    id="stepId"
                    name="stepId"
                    value={step.step_id || ""}
                  />

                  <div>
                    <button
                      type="button"
                      onClick={() => removeStep(index)}
                      className="plainButtonTrash"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>

                  <div className={styles.order}>{index + 1}</div>

                  <div className={styles.instruction}>
                    <textarea
                      id="instruction"
                      name="instruction"
                      rows="4"
                      cols="50"
                      value={step.instruction || ""}
                      onChange={(e) => {
                        const updatedSteps = formData.steps.map((s, idx) =>
                          idx === index
                            ? { ...s, instruction: e.target.value }
                            : s
                        );
                        setFormData({ ...formData, steps: updatedSteps });
                      }}
                    />
                  </div>
                  {data.error?.instruction && (
                    <div className="errors">{data.error.instruction}</div>
                  )}
                </div>
              ))}
              <button type="button" onClick={addStep}>
                Add Instruction Step
              </button>
            </div>
            {data.error?.steps && (
              <div className="errors">{data.error.steps}</div>
            )}
          </div>
        </div>
      </div>

      <div>
        <input
          type="hidden"
          id="recipe_id"
          name="recipe_id"
          value={formData.recipe_id || ""}
        />

        <input
          type="hidden"
          name="ingredients"
          value={JSON.stringify(formData.ingredients)}
        />

        <input
          type="hidden"
          name="steps"
          value={JSON.stringify(formData.steps)}
        />

        <FormSubmitButton btnPending="Saving" btnName="Save" />
      </div>
    </form>
  );
}