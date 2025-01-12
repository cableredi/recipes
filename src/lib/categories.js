import { prisma } from "@/lib/prisma";

export const getRecipeCount = async () => {
  const result = await prisma.categories.findMany({
    include: {
      _count: {
        select: { recipes: true },
      },
    },
  });

  return result;
};

export const getAllCategories = async () => {
  const result = await prisma.categories.findMany({
    orderBy: [{ name: "asc" }],
  });

  return result;
};

export const getCategory = async (category_id) => {
  if (category_id) {
    const result = await prisma.categories.findUnique({
      where: {
        category_id: Number(category_id),
      },
    });

    return result;
  } else {
    console.log(`Error getting category with category_id: ${category_id} `);
    return {
      errors: { error: "There was a problem getting the category" },
    };
  }
};

export const addCategory = async (name) => {
  if (name) {
    const result = await prisma.categories.create({
      data: {
        name: name,
      },
    });

    return result;
  } else {
    console.log(`Error adding new category with category name: ${name} `);

    return {
      error: { category: "There was a problem adding new category" },
    };
  }
};

export const updateCategory = async (category) => {
  if (Object.keys(category).length > 0) {
    const result = await prisma.categories.update({
      where: {
        category_id: Number(category.category_id),
      },
      data: {
        name: category.name,
      },
    });

    return result;
  } else {
    console.log(
      `Error updating category with category data: ${JSON.stringify(category)} `
    );
    return {
      errors: { error: "There was a problem updating category" },
    };
  }
};

export const deleteCategory = async (category_id) => {
  if (category_id) {
    const result = await prisma.categories.delete({
      where: {
        category_id: category_id,
      },
    });

    return result;
  } else {
    console.log(`Error deleting category with category_id: ${category_id} `);
    return {
      errors: { error: "There was a problem deleting category" },
    };
  }
};
