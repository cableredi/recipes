"use client";

import Link from "next/link";
import { useActionState, useState, useEffect } from "react";

import { auth } from "@/actions/auth-actions";
import styles from "./authForm.module.css";

export default function AuthForm({ mode, initialData }) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(auth.bind(null, mode), {
    errors: "",
    ...initialData,
  });

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form className={styles.authForm} action={formAction}>
      <p className={styles.header}>Recipes Login</p>

      {mode === "signup" && (
        <>
          <p>
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName || ""}
              onChange={handleChange}
            />
          </p>

          <p>
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName || ""}
              onChange={handleChange}
            />
          </p>
        </>
      )}

      <p>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email || ""}
          onChange={handleChange}
        />
      </p>

      <p>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" id="password" />
      </p>

      {mode === "signup" && (
        <p>
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" name="confirmPassword" id="confirmPassword" />
        </p>
      )}

      {data.errors && (
        <ul className="errors">
          {Object.keys(data.errors).map((error) => (
            <li key={error}>{data.errors[error]}</li>
          ))}
        </ul>
      )}

      <p>
        <button type="submit">
          {mode === "login" ? "Login" : "Create Account"}
        </button>
      </p>

      <p>
        {mode === "login" && (
          <Link href="/?mode=signup">Create an account.</Link>
        )}
        {mode === "signup" && (
          <Link href="/?mode=login">Login with existing account.</Link>
        )}
      </p>
    </form>
  );
}
