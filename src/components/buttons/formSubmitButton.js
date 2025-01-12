"use client";

import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import styles from "./buttons.module.css";

export default function FormSubmitButton({ btnPending, btnName, isDisabled }) {
  const { pending } = useFormStatus();
  const router = useRouter();

  const handleCancel = () => {
    router.back(); // Navigates to the previous page
  };

  return (
    <div className={styles.buttons}>
      <button disabled={pending || isDisabled}>
        {pending ? `${btnPending}...` : btnName}
      </button>

      <button type="button" onClick={handleCancel} className="plainButton">
        Cancel
      </button>
    </div>
  );
}
