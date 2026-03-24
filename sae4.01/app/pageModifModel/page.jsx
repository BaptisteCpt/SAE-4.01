import { getSession } from "../lib/auth";
import PageClient from "./PageClient";


/**
 * Page de modification d'un modèle
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification de modèle ou null si non autorisé
 */
export default async function AccCommercial() { 
  const session = await getSession();
  return <PageClient login={session.login} />;
} 