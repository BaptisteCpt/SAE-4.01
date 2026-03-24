import { Suspense } from "react";
import { getSession } from "../lib/auth";
import Generer from "./generer";

export default async function Page() {
  const session = await getSession();
  return (
    <Suspense fallback={<div className="page-wrapper">Chargement…</div>}>
      <Generer login={session.login} />
    </Suspense>
  );
}
