"use client";

import { IoTrashOutline } from "react-icons/io5";

export default function DeleteButton({ transaction, formAction, name }) {
  const handleDelete = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete this ${name}?`
    );
    if (confirm) {
      try {
        await formAction(transaction);
      } catch (error) {
        console.error("Error deleting recipe:", error);
        alert("Failed to delete recipe. Please try again.");
      }
    }
  };
  return (
    <button onClick={handleDelete} className="plainButtonTrash">
      <IoTrashOutline />
    </button>
  );
}
