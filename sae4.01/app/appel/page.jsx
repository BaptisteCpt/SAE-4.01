'use client'

import React, { useEffect } from 'react'
import Appel from '../components/Appel'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

/**
 * Page de gestion des appels de fonds
 * Réservée aux maîtres d'œuvre pour gérer les appels de fonds des chantiers
 * @returns {JSX.Element} La page d'appels de fonds
 */
export default function page() {

  return (
    <div className='Main'>
        <Nav/>
        <Appel/>
        <Footer/>
    </div>
  )
}