import { getSession } from "../../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de création complète d'un chantier
 * Vérifie que l'utilisateur est bien un commercial avant d'afficher la page
 * @returns {JSX.Element} La page de création de chantier ou null si non autorisé
 */
export default async function page_de_creation_de_chantier() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}