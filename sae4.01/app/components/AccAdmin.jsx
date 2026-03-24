"use client";
import "../css/accueil.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant de page d'accueil pour les administrateurs
 * Affiche un menu avec des boutons pour accéder aux différentes sections
 * @returns {JSX.Element} La page d'accueil administrateur
 */
export default function AccAdmin({ nom, prenom }) {
  const router = useRouter();


  /**
   * Redirige vers la page de liste des employés
   */
  function pageUtilisateurs() {
    router.push("/pageListeUtilisateurs");
  }

  /**
   * Redirige vers la page de gestion des chantiers
   */
  function pageChantier() {
    router.push("/pageAdminChantier");
  }

  /**
   * Redirige vers la page de liste des modèles
   */
  function pageModel() {
    router.push("/pageListeModel");
  }

  return (
    <>
      <div className="bulle_accueil">
        <h1>Bienvenue {nom} {prenom}</h1>
        <div className="boutons_accueil">
          <div className="bloc-accueil">
            <img
              src="/img/maison-icone.png"
              className="modeles-img"
              alt="Modèles"
              onClick={pageModel}
            />
            <button className="but" type="button" onClick={pageModel}>
              Liste des modèles
            </button>
          </div>

          <div className="bloc-accueil">
            <img
              src="/img/dossier.png"
              className="dossier-img"
              onClick={pageChantier}
              alt="Chantiers"
            />
            <button className="but" type="button" onClick={pageChantier}>
              Liste des chantiers
            </button>
          </div>

          <div className="bloc-accueil">
            <img
              src="/img/client.png"
              className="clients-img"
              onClick={pageUtilisateurs}
              alt="Employés"
            />
            <button className="but" type="button" onClick={pageUtilisateurs}>
              Liste des employés
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
