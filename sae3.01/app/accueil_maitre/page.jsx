'use client'

import React, { useEffect, useState } from 'react'
import Nav_maitreO from '../components/Nav_maitreO'
import AccMaitre from '../components/AccMaitre'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

/**
 * Page d'accueil pour les maîtres d'œuvre
 * Vérifie que l'utilisateur est bien un maître d'œuvre avant d'afficher la page
 * @returns {JSX.Element} La page d'accueil maître d'œuvre ou null si non autorisé
 */
export default function PageMaitreOeuvre() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false); 
  const [nom, setNom] = useState("");

  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un maître d'œuvre
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const nomStocke = localStorage.getItem("nom");

    if (role === "maitre Oeuvre") {
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
      <Nav_maitreO />
      <AccMaitre />
      <Footer />
    </div>
  )
}
