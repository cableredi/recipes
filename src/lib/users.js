import { prisma } from "@/lib/prisma";

export const getAllUsers = async () => {
  const result = await prisma.user.findMany();

  return result;
};

export const editUser = async (userData) => {
  if (!userData.id) {
    console.error("Invalid user data: Missing user ID.");
    return {
      errors: { error: "User ID is required for updating the profile." },
    };
  }

  try {
    const result = await prisma.user.update({
      where: { id: userData.id },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        passwordHash: userData.passwordHash,
        role: userData.role,
        email: userData.email,
      },
    });
    return result;
  } catch (error) {
    console.error("Error updating user data:", error);
    return { errors: { error: "Failed to update user data." } };
  }
};

export const editRole = async (user) => {
  if (user.id) {
    try {
      let result;

      result = await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          role: user.role,
        },
      });

      return result;
    } catch (error) {
      console.log(`Error updating user role ${error.message} `);
      return {
        errors: { error: "There was a problem updating user role" },
      };
    }
  }
};
