"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

import { verifyPasswordHash, hashPassword } from "@/lib/auth/password";
import {
  generateRandomSessionToken,
  createSession,
  invalidateSession,
} from "@/lib/auth/session";
import {
  setSessionCookie,
  getAuth,
  deleteSessionCookie,
} from "@/lib/auth/cookie";

export const signIn = async (prevState, formData) => {
  const formDataRaw = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  let errors = {};

  if (!formDataRaw.email) {
    errors.email = "Please enter a valid email address.";
  }

  if (!formDataRaw.password.trim()) {
    errors.password = "Please enter a valid password.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: formDataRaw.email },
    });

    if (!user) {
      return {
        errors: { error: "Invalid email or password." },
      };
    }

    const validPassword = await verifyPasswordHash(
      user.passwordHash,
      formDataRaw.password
    );

    if (!validPassword) {
      return {
        errors: { error: "Invalid email or password." },
      };
    }

    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    console.log(`Login ERROR: ${error} - ${error.code}`);

    return {
      errors: { error: "Unable to log you in.  Please try again later" },
    };
  }

  redirect("/main");
};

export const signUp = async (prevState, formData) => {
  const formDataRaw = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
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

  if (formDataRaw.password !== formDataRaw.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  if (!formDataRaw.email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (formDataRaw.password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    const passwordHash = await hashPassword(formDataRaw.password);

    const user = await prisma.user.create({
      data: {
        firstName: formDataRaw.firstName,
        lastName: formDataRaw.lastName,
        email: formDataRaw.email,
        passwordHash,
      },
    });

    const sessionToken = generateRandomSessionToken();
    const session = await createSession(sessionToken, user.id);

    await setSessionCookie(sessionToken, session.expiresAt);
  } catch (error) {
    console.log(`Create New User ERROR: ${error}`);

    if (error.code === "P2002") {
      return {
        errors: { error: "This email is already in our system" },
      };
    }

    return {
      errors: { error: "Unable to create new user.  Please try again later" },
    };
  }

  redirect("/main");
};

export const signOut = async () => {
  const { session } = await getAuth();

  if (!session) {
    redirect("/");
  }

  await invalidateSession(session.id);
  await deleteSessionCookie();

  redirect("/");
};

export const auth = async (mode, prevState, formData) => {
  if (mode === "login") {
    return signIn(prevState, formData);
  }

  return signUp(prevState, formData);
};
