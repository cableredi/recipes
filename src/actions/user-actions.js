"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { verifyPasswordHash, hashPassword } from "@/lib/auth/password";

import { editUser, editRole } from "@/lib/users";

export async function editUserAction(prevState, formData) {
  const formDataRaw = {
    id: formData.get("user_id"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    currentPassword: formData.get("currentPassword"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  };

  let errors = {};

  if (!formDataRaw.firstName) {
    errors.firstName = "Please enter your first name.";
  }

  if (!formDataRaw.lastName) {
    errors.lastName = "Please enter your last name.";
  }

  if (
    formDataRaw.password.trim().length > 0 &&
    formDataRaw.confirmPassword.trim().length > 0
  ) {
    if (formDataRaw.currentPassword.trim().length === 0) {
      errors.currentPassword =
        "Please enter your current password so you can update it";
    }
  }

  if (formDataRaw.password !== formDataRaw.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (formDataRaw.password.trim().length > 0) {
    if (formDataRaw.password.trim().length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: formDataRaw.id },
    });

    if (!user) {
      return {
        errors: { error: "Invalid email or password." },
      };
    }

    let userData;

    if (
      formDataRaw.currentPassword.trim().length > 0 &&
      formDataRaw.password.trim().length > 0
    ) {
      const validPassword = await verifyPasswordHash(
        user.passwordHash,
        formDataRaw.currentPassword
      );

      if (!validPassword) {
        console.log("Invalid current Password");

        return {
          errors: { error: "Invalid current password." },
        };
      }

      const passwordHash = await hashPassword(formDataRaw.password);

      userData = {
        id: formDataRaw.id,
        firstName: formDataRaw.firstName,
        lastName: formDataRaw.lastName,
        email: user.email,
        passwordHash: passwordHash,
        role: user.role,
      };
    } else {
      userData = {
        id: formDataRaw.id,
        firstName: formDataRaw.firstName,
        lastName: formDataRaw.lastName,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role,
      };
    }

    editUser(userData);
  } catch (error) {
    console.log(`Update user error:  ${error.code}`);

    return {
      errors: { error: "Unable to update your profile" },
    };
  }

  revalidatePath("/main");
  redirect("/main");
}

export async function editRoleAction(prevState, formData) {
  const userRoles = formData.get("roles");

  try {
    JSON.parse(userRoles).map((user) => {
      editRole(user);
    });
  } catch (error) {
    console.log(`Update user role: ${error.message}`);

    return {
      errors: { error: "Unable to update your user role" },
    };
  }

  revalidatePath("/users");
  redirect("/users");
}
