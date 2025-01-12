"use client";

import React from "react";

import { useActionState, useState, useEffect } from "react";
import { editRoleAction } from "@/actions/user-actions";
import FormSubmitButton from "@/components/buttons/formSubmitButton";

import styles from "./userForm.module.css";

export default function UserForm({ initialData, roles }) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(editRoleAction, {
    errors: "",
    ...initialData,
  });

  // Update formData when initialData changes
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (userId, role) => {
    setFormData((prevFormData) =>
      prevFormData.map((user) =>
        user.id === userId ? { ...user, role } : user
      )
    );
  };

  return (
    <form action={formAction} className={styles.userForm}>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
          </tr>
        </thead>
        
        <tbody>
          {formData.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.name}</td>
              <td className={styles.flex}>
                {roles.map((role) => (
                  <div key={`${user.id}-${role.role_id}`}>
                    <input
                      type="radio"
                      name={`role_${user.id}`}
                      value={role.name}
                      checked={user.role === role.name}
                      onChange={() => handleChange(user.id, role.name)}
                    />
                    <label htmlFor={`role_${user.id}_${role.id}`}>
                      {role.name}
                    </label>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {data.errors?.error && <div className='errors'>{data.errors.error}</div>}

      <div>
        <input
          type="hidden"
          name="roles"
          value={JSON.stringify(formData)}
        />

        <FormSubmitButton btnPending="Saving" btnName="Save" />
      </div>
    </form>
  );
}
