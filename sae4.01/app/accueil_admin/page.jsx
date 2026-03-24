import { getSession } from "../lib/auth";
import Accueil from "./accueil";

export default async function Page() {
  const session = await getSession();
  return <Accueil login={session.login} nom={session.nom} prenom={session.prenom} />;
}
