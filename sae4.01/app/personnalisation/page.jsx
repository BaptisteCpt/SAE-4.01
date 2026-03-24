import { getSession } from "../lib/auth";
import PageClient from "./PageClient";

/**
 * Page de personnalisation des étapes d'un chantier
 * Réservée aux maîtres d'œuvre pour personnaliser les étapes
 * @returns {JSX.Element} La page de personnalisation
 */
export default async function PersonnalisationPage() {
  const session = await getSession();
  return <PageClient login={session.login} />;
}
