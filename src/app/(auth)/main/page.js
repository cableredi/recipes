import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/cookie";

export default async function MainPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <main>
        <h3>Welcome {user.firstName}!</h3>
      </main>
    </>
  );
}
