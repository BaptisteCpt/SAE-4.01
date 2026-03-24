import { getSession } from "../lib/auth";
import ListeClientsPage from "./ListeClientsPage";

export default async function Page() {
  const session = await getSession();
  return <ListeClientsPage role={session.role} login={session.login} />;
}
