"use client";

import { useActionState, useState, useEffect } from "react";
import {
  addCategoryAction,
  editCategoryAction,
} from "@/actions/category-actions";

import FormSubmitButton from "@/components/buttons/formSubmitButton";

import styles from "./categoryForm.module.css";

export default function CategoryForm({ initialData, categoryAction }) {
  const [formData, setFormData] = useState(initialData);

  const [data, formAction, isPending] = useActionState(
    categoryAction === "edit" ? editCategoryAction : addCategoryAction,
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

  return (
    <form action={formAction} className={styles.categoryForm}>
      <div>
        <label htmlFor="name">Category Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}
          onChange={handleChange}
        />
      </div>

      {data.error?.category && <p className="errors">{data.error.category}</p>}

      <div>
        <input
          type="hidden"
          id="categoryID"
          name="categoryID"
          value={formData.category_id || ""}
        />

        <FormSubmitButton btnPending="Saving" btnName="Save" />
      </div>
    </form>
  );
}
