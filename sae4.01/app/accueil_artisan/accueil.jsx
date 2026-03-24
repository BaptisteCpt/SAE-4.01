"use client";

import React from "react";
import AccArtisan from "../components/AccArtisan";
import Footer from "../components/Footer";
import NavArtisan from "../components/Nav_artisan";

/**
 * Page d'accueil artisan.
 * Affiche le menu principal artisan (front uniquement).
 * @returns {JSX.Element} La page d'accueil artisan
 */
export default function PageAccueilArtisan({ login, nom, prenom}) {
  return (
    <div className="page-wrapper">
      <NavArtisan login={login} />
      <AccArtisan nom={nom} prenom={prenom} />
      <Footer />
    </div>
  );
}
