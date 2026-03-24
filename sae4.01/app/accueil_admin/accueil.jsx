"use client";

import React, { useEffect, useState } from "react";
import Nav_admin from "../components/Nav_admin";
import Footer from "../components/Footer";
import AccAdmin from "../components/AccAdmin";

/**
 * Page d'accueil pour les administrateurs
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page d'accueil administrateur ou null si non autorisé
 */
export default function PageAdmin({ login, nom, prenom }) {
  return (
    <div className="page-wrapper">
      <Nav_admin login={login} />
      <AccAdmin nom={nom} prenom={prenom} />
      <Footer />
    </div>
  );
}
