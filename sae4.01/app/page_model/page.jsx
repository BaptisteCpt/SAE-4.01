import { getSession } from "../lib/auth";
import ListeModelPage from "./ListeModelPage";

export default async function Page() {
  const session = await getSession();
  return <ListeModelPage role={session.role} login={session.login} />;
}
