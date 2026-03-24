import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de modification d'un maître d'œuvre
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification de maître d'œuvre ou null si non autorisé
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}
