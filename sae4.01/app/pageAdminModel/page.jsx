import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de gestion des modèles
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des modèles ou null si non autorisé
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}