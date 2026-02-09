'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Nav_M from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import styles from '../css/pmodel.css'
import PModel from '../components/PModel'
import { useRouter } from 'next/navigation'

/**
 * Page de liste des modèles pour commerciaux et maîtres d'œuvre
 * Affiche la barre de navigation appropriée selon le rôle de l'utilisateur
 * @returns {JSX.Element} La page de liste des modèles
 */
export default function page() {
  const [navBar, setNavBar] = useState(null); 
  const router = useRouter();

  /**
   * Détermine quelle barre de navigation afficher selon le rôle de l'utilisateur
   */
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "commercial") {
      setNavBar(<Nav_commercial/>);
    } else if(role === "maitre Oeuvre") {
      setNavBar(<Nav_M/>);
    } else {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="page-wrapper">
      { navBar } 
      <PModel/>
      <Footer/>
    </div>
  )
}
