import { getSession } from "../lib/auth";
import Liste from "./liste";

export default async function Page() {
  const session = await getSession();
  return <Liste login={session.login} />;
}
