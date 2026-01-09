'use client'

import React, { useEffect, useState } from 'react'
import Nav_admin from '../components/Nav_admin'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import AccAdmin from '../components/AccAdmin'

/**
 * Page d'accueil pour les administrateurs
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page d'accueil administrateur ou null si non autorisé
 */
export default function PageAdmin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false); 
  const [nom, setNom] = useState("");

  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un administrateur
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const nomStocke = localStorage.getItem("nom");

 
    if (role === "admin") {
      setAuthorized(true);
      setNom(nomStocke);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <div className="page-wrapper">
      <Nav_admin />
      <AccAdmin/>
      <Footer />
    </div>
  )
}
