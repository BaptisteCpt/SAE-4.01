import { headers } from "next/headers";

export async function getSession() {
  const headersList = await headers();
  const role = headersList.get("x-user-role");
  const login = headersList.get("x-user-login");
  const nom = headersList.get("x-user-nom");
  const prenom = headersList.get("x-user-prenom");

  if (!role) return null;
  return { role, login, nom, prenom };
}