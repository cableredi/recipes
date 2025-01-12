import { prisma } from "@/lib/prisma";

export const getRoles = async () => {
  const result = await prisma.roles.findMany();

  return result;
};
