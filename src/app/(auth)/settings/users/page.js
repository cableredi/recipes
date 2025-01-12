import { getAuth } from "@/lib/auth/cookie";
import { getRoles } from "@/lib/roles";
import { getAllUsers } from "@/lib/users";

import SubHeader from "@/components/headers/subHeader";
import UserForm from "@/components/settings/userForm";

export default async function UsersPage() {
  const { user } = await getAuth();

  if (!user) {
    redirect("/");
  }

  let users, roles;

  try {
    users = await getAllUsers();
    roles = await getRoles();
  } catch (error) {
    console.log("Error getting roles or users:", error);
  }

  let initialData = [];

  users.map((user) => {
    initialData.push({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
    });
  });

  return (
    <section>
      <SubHeader name="Users" />

      <UserForm initialData={initialData} roles={roles} />
    </section>
  );
}
