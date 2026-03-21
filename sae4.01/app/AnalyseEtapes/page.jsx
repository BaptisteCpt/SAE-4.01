'use client'

import React, { useEffect } from 'react'
import Facture from '../components/AnalyseEtapes'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import "../css/bench.css";

/**
 * Page de gestion des factures des artisans
 * Réservée aux maîtres d'œuvre pour gérer les factures des artisans des chantiers
 * @returns {JSX.Element} La page des factures des artisans
 */
export default function page() {
  const router = useRouter();

  /**
   * Vérifie le rôle de l'utilisateur et redirige si ce n'est pas un maître d'œuvre
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "maitre Oeuvre") {
      router.push('/');
    }
  }, [router]);

  return (
    <div className='Main'>
        <Nav/>
        <Facture/>
        <Footer/>
    </div>
  )
}