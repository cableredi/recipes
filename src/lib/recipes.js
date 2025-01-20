import { prisma } from "@/lib/prisma";

export const getRecipe = async (recipe_id) => {
  const result = await prisma.recipes.findUnique({
    where: { recipe_id: Number(recipe_id) },
    include: {
      instructions: {
        include: {
          steps: true,
        },
      },
      ingredients: {
        include: {
          items: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return result;
};

export const getAllRecipes = async () => {
  const result = await prisma.recipes.findMany({
    orderBy: [{ name: "asc" }],
  });

  return result;
};

export const getAllRecipesGroupedByCategory = async () => {
  const result = await prisma.recipes.findMany({
    select: {
      recipe_id: true,
      name: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return result;
};

export const addRecipe = async (recipe) => {
  if (Object.keys(recipe).length > 0) {
    try {
      const recipeResult = await prisma.recipes.create({
        data: {
          category_id: recipe.category_id,
          name: recipe.name,
          image: "",
          instructions: {
            create: recipe.instructions.map((instruction, index) => ({
              topic: instruction.topic,
              steps: {
                create: instruction.steps.map((step) => ({
                  step_number: index + 1,
                  instruction: step.instruction,
                })),
              },
            })),
          },
          ingredients: {
            create: recipe.ingredients.map((ingred) => ({
              topic: ingred.topic,
              items: {
                create: ingred.items.map((item) => ({
                  name: item.name,
                  amount: item.amount,
                })),
              },
            })),
          },
        },
      });

      return recipeResult;
    } catch (error) {
      console.error("Error in adding recipe:", error.code, error.message);

      return { error: error.message };
    }
  } else {
    console.log(`Error adding new recipe - no data `);
    return {
      errors: { error: "There was a problem adding new recipe" },
    };
  }
};

export const editRecipe = async (recipe) => {
  if (Object.keys(recipe).length > 0) {
    try {
      const recipeResult = await prisma.recipes.update({
        where: {
          recipe_id: Number(recipe.recipe_id), // Recipe ID to update
        },
        data: {
          category_id: Number(recipe.category_id),
          name: recipe.name,
          image: "",
          instructions: {
            deleteMany: {
              instruction_id: {
                notIn: recipe.instructions.map(
                  (instruct) => instruct.instruction_id || 0
                ), // Delete ingredients not in the incoming array
              },
            },
            upsert: recipe.instructions.map((instruct) => ({
              where: { instruction_id: instruct.instruction_id || 0 }, // Match by ingredient ID, or add if it's new
              create: {
                topic: instruct.topic,
                steps: {
                  create: instruct.steps.map((step, index) => ({
                    step_number: index + 1,
                    instruction: step.instruction,
                  })),
                },
              },
              update: {
                topic: instruct.topic,
                // stepsNew: {
                steps: {
                  deleteMany: {
                    step_id: {
                      notIn: instruct.steps.map((step) => step.step_id || 0), // Delete items not in the incoming array
                    },
                  },
                  upsert: instruct.steps.map((step, index) => ({
                    where: { step_id: step.step_id || 0 }, // Match by item ID, or add if it's new
                    create: {
                      step_number: index + 1,
                      instruction: step.instruction,
                    },
                    update: {
                      step_number: index + 1,
                      instruction: step.instruction,
                    },
                  })),
                },
              },
            })),
          },
          ingredients: {
            deleteMany: {
              ingredient_id: {
                notIn: recipe.ingredients.map(
                  (ingred) => ingred.ingredient_id || 0
                ), // Delete ingredients not in the incoming array
              },
            },
            upsert: recipe.ingredients.map((ingred) => ({
              where: { ingredient_id: ingred.ingredient_id || 0 }, // Match by ingredient ID, or add if it's new
              create: {
                topic: ingred.topic,
                items: {
                  create: ingred.items.map((item) => ({
                    name: item.name,
                    amount: item.amount,
                  })),
                },
              },
              update: {
                topic: ingred.topic,
                items: {
                  deleteMany: {
                    item_id: {
                      notIn: ingred.items.map((item) => item.item_id || 0), // Delete items not in the incoming array
                    },
                  },
                  upsert: ingred.items.map((item) => ({
                    where: { item_id: item.item_id || 0 }, // Match by item ID, or add if it's new
                    create: {
                      name: item.name,
                      amount: item.amount,
                    },
                    update: {
                      name: item.name,
                      amount: item.amount,
                    },
                  })),
                },
              },
            })),
          },
        },
      });

      return recipeResult;
    } catch (error) {
      console.error("Error in editing recipe:", error.code, error.message);

      return { error: error.message };
    }
  } else {
    console.log(`Error editing recipe - no data `);
    return {
      errors: { error: "There was a problem editing your recipe" },
    };
  }
};

export const editRecipeNotes = async (recipe) => {
  if (Object.keys(recipe).length > 0) {
    try {
      const result = await prisma.recipes.update({
        where: {
          recipe_id: Number(recipe.recipe_id), // Recipe ID to update
        },
        data: {
          note: recipe.note,
        },
      });

      return result;
    } catch (error) {
      console.error("Error in adding recipe:", error.code, error.message);

      return { error: error.message };
    }
  } else {
    console.log(`Error editing recipe notes - no data `);
    return {
      errors: { error: "There was a problem editing recipe notes" },
    };
  }
};

export const deleteRecipe = async (recipe_id) => {
  if (recipe_id) {
    const result = await prisma.recipes.delete({
      where: {
        recipe_id: recipe_id,
      },
    });

    return result;
  } else {
    console.log(`Error deleting recipe with recipe_id: ${recipe_id} `);

    return {
      errors: { error: "There was a problem deleting recipe" },
    };
  }
};
