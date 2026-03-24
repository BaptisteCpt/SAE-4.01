import { getSession } from "../lib/auth";
import Generer from "./generer";

export default async function Page() {
  const session = await getSession();
  return <Generer login={session.login} />;
}
