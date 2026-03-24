import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de gestion des appels de fonds
 * Réservée aux maîtres d'œuvre pour gérer les appels de fonds des chantiers
 * @returns {JSX.Element} La page d'appels de fonds
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}