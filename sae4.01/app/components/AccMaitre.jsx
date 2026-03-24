"use client";

import "../css/accueil.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant de page d'accueil pour les maîtres d'œuvre
 * Affiche un menu avec des boutons pour accéder aux différentes sections
 * @returns {JSX.Element} La page d'accueil maître d'œuvre
 */
export default function AccMaitre({ nom, prenom }) {
  const router = useRouter();


  /**
   * Redirige vers la page de liste des modèles
   */
  function pageModele() {
    router.push("/page_model");
  }

  /**
   * Redirige vers la page de personnalisation des étapes
   */
  function pagePerso() {
    router.push("/personnalisation");
  }

  /**
   * Redirige vers la page de suivi de chantier
   */
  function pageSuivi() {
    router.push("/suivi");
  }

  /**
   * Redirige vers la page d'affectation des artisans
   */
  function pageArti() {
    router.push("/affectation");
  }

  /**
   * Redirige vers la page d'appel de fonds
   */
  function pageAppel() {
    router.push("/appel");
  }

  /**
   * Redirige vers la page d'analyse d'étapes
   */
  function pageAnalyse() {
    router.push("/AnalyseEtapes");
  }
  return (
    <div className="bulle_accueil">
      <h1>Bienvenue {nom} {prenom}</h1>
      <div className="boutons_accueil">
        <div className="bloc-accueil">
          <img src="/img/maison-icone.png" onClick={pageModele} />
          <button className="but" type="button" onClick={pageModele}>
            Liste des modèles
          </button>
        </div>

        <div className="bloc-accueil">
          <img src="/img/dossier.png" onClick={pagePerso} />
          <button className="but" type="button" onClick={pagePerso}>
            Personnalisation des étapes
          </button>
        </div>

        <div className="bloc-accueil">
          <img src="/img/calendrier.png" onClick={pageSuivi} />
          <button className="but" type="button" onClick={pageSuivi}>
            Suivi d'un Chantier
          </button>
        </div>

        <div className="bloc-accueil">
          <img src="/img/client.png" onClick={pageArti} />
          <button className="but" type="button" onClick={pageArti}>
            Affectation des artisans
          </button>
        </div>

        <div className="bloc-accueil">
          <img src="/img/money.png" onClick={pageAppel} />
          <button className="but" type="button" onClick={pageAppel}>
            Appel de fonds
          </button>
        </div>

        <div className="bloc-accueil">
          <img src="/img/analyse.png" onClick={pageAnalyse} />
          <button className="but" type="button" onClick={pageAnalyse}>
            Analyse des étapes
          </button>
        </div>
      </div>
    </div>
  );
}
