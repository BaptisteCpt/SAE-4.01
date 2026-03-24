import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de suivi d'un chantier
 * Réservée aux maîtres d'œuvre pour suivre l'avancement des chantiers
 * @returns {JSX.Element} La page de suivi
 */
export default async function page() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}
