"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

import AuthForm from "@/components/auth/authForm";

export default function HomePage() {
  const searchParams = useSearchParams();
  const formMode = searchParams.get("mode") ?? "login";
  const initialData = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  return (
    <Suspense>
      <AuthForm mode={formMode} initialData={{ initialData }} />
    </Suspense>
  );
}
