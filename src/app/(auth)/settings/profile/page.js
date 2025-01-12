import { getAuth } from "@/lib/auth/cookie";

import SubHeader from "@/components/headers/subHeader";
import ProfileForm from "@/components/settings/profileForm";
import React from "react";

export default async function ProfilePage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <React.Fragment>
      <SubHeader name="Profile" />

      <ProfileForm initialData={user} />
    </React.Fragment>
  );
}