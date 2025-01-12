"use client";

import React from "react";

import { useActionState, useState, useEffect } from "react";
import { editUserAction } from "@/actions/user-actions";
import FormSubmitButton from "@/components/buttons/formSubmitButton";

import styles from "./profileForm.module.css";

export default function ProfileForm({ initialData }) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(editUserAction, {
    errors: "",
    ...initialData,
  });

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form action={formAction} className={styles.profileForm}>
      <div className={styles.flex}>
        <label>Email</label>
        <div>{formData.email}</div>
      </div>

      <div className={styles.flex}>
        <label>Role</label>
        <div>{formData.role}</div>
      </div>

      <div>
        <label htmlFor="firstName">First name</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          value={formData.firstName || ""}
          onChange={handleChange}
        />
      </div>

      {data.errors?.firstName && (
        <div className="errors">{data.errors.firstName}</div>
      )}

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          value={formData.lastName || ""}
          onChange={handleChange}
        />
      </div>

      {data.errors?.lastName && (
        <div className="errors">{data.errors.lastName}</div>
      )}

      <h3>Change Password</h3>

      <div>
        <label htmlFor="currentPassword">Current Password</label>
        <input type="password" name="currentPassword" id="currentPassword" />
      </div>

      {data.errors?.currentPassword && (
        <div className="errors">{data.errors.currentPassword}</div>
      )}

      <div>
        <label htmlFor="password">New Password</label>
        <input type="password" name="password" id="password" />
      </div>

      <div>
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input type="password" name="confirmPassword" id="confirmPassword" />
      </div>

      {data.errors?.confirmPassword && (
        <div className="errors">{data.errors.confirmPassword}</div>
      )}

      {data.errors?.password && (
        <div className="errors">{data.errors.password}</div>
      )}

      {data.errors?.error && <div className="errors">{data.errors.error}</div>}

      <div>
        <input type="hidden" name="user_id" value={formData.id} />

        <FormSubmitButton btnPending="Saving" btnName="Save" />
      </div>
    </form>
  );
}
