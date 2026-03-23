"use client";

import "../css/accueil.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant de page d'accueil pour les artisans
 * Affiche un menu avec des boutons pour accéder aux différentes sections
 * @returns {JSX.Element} La page d'accueil artisan
 */
export default function AccArtisan() {
  const [nom, setNom] = useState("");
  const router = useRouter();

  useEffect(() => {
    const nomStocke = localStorage.getItem("nom");
    if (nomStocke) {
      setNom(nomStocke);
    }
  }, []);

  function goListeChantiers() {
    router.push("/liste_chantiers_artisan");
  }

  /**
   * Action front temporaire pour la génération de facture.
   */
  function genererFacture() {
    window.alert("Generation de facture (front en cours)");
  }

  return (
    <div className="bulle_accueil">
      <h1>Bienvenue {nom}</h1>
      <div className="boutons_accueil">
        <div className="bloc-accueil" id="liste-chantiers">
          <img src="/img/calendrier.png" alt="Liste des chantiers" onClick={goListeChantiers} />
          <button className="but" type="button" onClick={goListeChantiers}>
            Liste des chantiers
          </button>
        </div>

        <div className="bloc-accueil" id="generer-facture">
          <img src="/img/money.png" onClick={genererFacture} />
          <button className="but" type="button" onClick={genererFacture}>
            Generer une facture
          </button>
        </div>
      </div>
    </div>
  );
}
