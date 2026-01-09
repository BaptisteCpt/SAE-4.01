'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import AccCommercial from '../components/AccCommercial'

/**
 * Page d'accueil pour les commerciaux
 * Vérifie que l'utilisateur est bien un commercial avant d'afficher la page
 * @returns {JSX.Element} La page d'accueil commercial ou null si non autorisé
 */
export default function page() {
  const router = useRouter();
  const [acces, setAccess] = useState(false);
  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un commercial
   */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "commercial") {
      setAccess(true);
    } else {
      router.push('/');
    }
  }, [router]);
  if (!acces) {
    return null; 
  }

  return (
    <div className="page-wrapper">
      <Nav_commercial/>
      <AccCommercial/>
      <Footer/>
    </div>
  )
}
