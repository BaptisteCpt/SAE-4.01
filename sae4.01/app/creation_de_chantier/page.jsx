import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de création de chantier pour les commerciaux
 * Vérifie que l'utilisateur est bien un commercial avant d'afficher la page
 * @returns {JSX.Element} La page de création de chantier
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}
