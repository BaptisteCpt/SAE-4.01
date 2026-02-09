'use client'

import React, { useEffect } from 'react'
import Suivi from '../components/Suivi'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

/**
 * Page de suivi d'un chantier
 * Réservée aux maîtres d'œuvre pour suivre l'avancement des chantiers
 * @returns {JSX.Element} La page de suivi
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
    <div className='page-wrapper'>
        <Nav/>
        <Suivi/>
        <Footer/>
    </div>
  )
}
