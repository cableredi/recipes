"use client";

import { useFormStatus } from "react-dom";

import styles from "./buttons.module.css";

export default function EditorSubmitButton({
  btnPending,
  btnName,
  isDisabled,
}) {
  const { pending } = useFormStatus();

  return (
    <div className={styles.buttons}>
      <button disabled={pending || isDisabled}>
        {pending ? `${btnPending}...` : btnName}
      </button>
    </div>
  );
}
