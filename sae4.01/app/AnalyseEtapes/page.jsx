import { getSession } from "../lib/auth";
import PageClient from "./analyse";

/**
 * Page de gestion des factures des artisans
 * Réservée aux maîtres d'œuvre pour gérer les factures des artisans des chantiers
 * @returns {JSX.Element} La page des factures des artisans
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}