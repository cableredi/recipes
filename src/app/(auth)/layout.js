import { redirect } from "next/navigation";
import { getAuth } from "@/lib/auth/cookie";

import Navigation from "@/components/navigation/navigation";
import styles from "./layout.module.css";

export default async function AuthLayout({ children }) {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <main>
        <section className={styles.section}>
          <Navigation />

          <main>{children}</main>
        </section>
      </main>
    </>
  );
}
