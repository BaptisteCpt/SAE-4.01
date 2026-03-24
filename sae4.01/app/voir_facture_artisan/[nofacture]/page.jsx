import { getSession } from "../../lib/auth";
import VoirFactureArtisan from "./voir";

export default async function Page({ params }) {
  const session = await getSession();
  const { nofacture } = await params;
  return <VoirFactureArtisan login={session.login} nofacture={nofacture} />;
}
