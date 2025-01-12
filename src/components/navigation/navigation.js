import Link from "next/link";

import { signOut } from "@/actions/auth-actions";
import { getAuth, checkRole } from "@/lib/auth/cookie";

import styles from "./navigation.module.css";

export default async function Navigation() {
  const { user } = await getAuth();

  const hasAccess = await checkRole(user.role);

  return (
    <aside className={styles.aside}>
      {hasAccess && (
        <>
          <h3>Recipes</h3>

          <ul>
            <li>
              <Link href="/recipes">..by Recipe Name</Link>
            </li>

            <li>
              <Link href="/categories">...by Category</Link>
            </li>
          </ul>

          <hr />

          <h3>Administration</h3>

          <ul>
            <li>
              <Link href="/admin/category">Categories</Link>
            </li>

            <li>
              <Link href="/admin/recipe">Recipes</Link>
            </li>
          </ul>

          <h3>Settings</h3>

          <ul>
            <li>
              <Link href="/settings/users">Users</Link>
            </li>
            <li>
              <Link href="/settings/profile">Profile</Link>
            </li>
          </ul>

          <form action={signOut}>
            <button type="submit">Sign Out</button>
          </form>
        </>
      )}

      {!hasAccess && (
        <>
          <ul>
            <li>
              <Link href="/settings/profile">Profile</Link>
            </li>
          </ul>
          
          <form action={signOut}>
            <button type="submit">Sign Out</button>
          </form>
        </>
      )}
    </aside>
  );
}
