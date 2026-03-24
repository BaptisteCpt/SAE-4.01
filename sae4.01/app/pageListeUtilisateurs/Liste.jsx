"use client";

import "../css/accueil.css";
import "../css/admin-list.css";
import { useState, useEffect } from "react";
import Nav_admin from "../components/Nav_admin";
import EmployeForm from "../components/EmployeForm";
import Footer from "../components/Footer";

/**
 * Page de gestion des employés
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des employés ou null si non autorisé
 */
export default function AccCommercial({ login }) {
  return (
    <>
      <Nav_admin />
      <EmployeForm login={login} />
      <Footer />
    </>
  );
}
