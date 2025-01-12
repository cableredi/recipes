import { getAuth } from "@/lib/auth/cookie";

import SubHeader from "@/components/headers/subHeader";
import ProfileForm from "@/components/settings/profileForm";

export default async function ProfilePage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <SubHeader name="Profile" />

      <ProfileForm initialData={user} />
    </>
  );
}
