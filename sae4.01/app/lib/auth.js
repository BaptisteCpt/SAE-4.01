import { cookies, headers } from "next/headers";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function getSession() {
  const headersList = await headers();
  const role = headersList.get("x-user-role");
  const login = headersList.get("x-user-login");
  const nom = headersList.get("x-user-nom");
  const prenom = headersList.get("x-user-prenom");

  if (!role) return null;
  return { role, login, nom, prenom };
}

/**
 * Session JWT depuis le cookie (routes API).
 * @returns {Promise<{ role: string, login: string, nom?: string, prenom?: string } | null>}
 */
export async function getApiSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return {
      role: payload.role,
      login: payload.login,
      nom: payload.nom,
      prenom: payload.prenom,
    };
  } catch {
    return null;
  }
}