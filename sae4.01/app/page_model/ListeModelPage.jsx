"use client";

import React, { useEffect, useState } from "react";
import Nav_commercial from "../components/Nav_commercial";
import Nav_M from "../components/Nav_maitreO";
import Footer from "../components/Footer";
import styles from "../css/pmodel.css";
import PModel from "../components/PModel";
import { useRouter } from "next/navigation";

/**
 * Page de liste des modèles pour commerciaux et maîtres d'œuvre
 * Affiche la barre de navigation appropriée selon le rôle de l'utilisateur
 * @returns {JSX.Element} La page de liste des modèles
 */
export default function page({ role }) {
  // Le rôle arrive en prop depuis le serveur
  return (
    <div className="page-wrapper">
      {role === "maitre Oeuvre" && <Nav_M />}
      {role === "commercial" && <Nav_commercial />}
      <PModel />
      <Footer />
    </div>
  );
}
