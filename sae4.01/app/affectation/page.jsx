import { getSession } from "../lib/auth";
import Affectation from "./affectation";

/**
 * Page d'affectation des artisans aux étapes
 * Réservée aux maîtres d'œuvre pour affecter des artisans aux étapes des chantiers
 * @returns {JSX.Element} La page d'affectation des artisans
 */
export default async function page() {
  const session = await getSession();
  return <Affectation login={session.login} />;
}
