import { redirect } from "next/navigation";

import SubHeader from "@/components/headers/subHeader";
import { getAuth } from "@/lib/auth/cookie";

export default async function MainPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return <SubHeader name={`Welcome ${user.firstName}!`} />;
}
