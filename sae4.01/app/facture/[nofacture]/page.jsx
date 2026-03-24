import { getSession } from "../../lib/auth";
import PageClient from "./PageClient";

export default async function Page({ params }) {
  const { nofacture } = await params;
  const session = await getSession();
  return <PageClient login={session.login} nofacture={nofacture} />;
}
