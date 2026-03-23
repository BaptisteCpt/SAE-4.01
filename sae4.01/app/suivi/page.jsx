'use client'

import React, { useEffect } from 'react'
import Suivi from '../components/Suivi'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'

/**
 * Page de suivi d'un chantier
 * Réservée aux maîtres d'œuvre pour suivre l'avancement des chantiers
 * @returns {JSX.Element} La page de suivi
 */
export default function page() {

  return (
    <div className='page-wrapper'>
        <Nav/>
        <Suivi/>
        <Footer/>
    </div>
  )
}
