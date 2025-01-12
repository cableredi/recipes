"use client";

import { useRouter } from "next/navigation";

function BackButton() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <button onClick={handleGoBack} className="button">
      Go Back
    </button>
  );
}

export default BackButton;
