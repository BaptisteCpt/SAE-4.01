"use client";

import Reset from "../components/ResetPassWord";
import "../css/profil.css";

export default function ReinitialiserMdp() {
  return (
    <main className="profil-page">
      <div className="bulle_login">
        <h1>Réinitialiser votre mot de passe</h1>
        <Suspense fallback={<p>Chargement du formulaire...</p>}>
          <Reset />
        </Suspense>{" "}
      </div>
    </main>
  );
}
