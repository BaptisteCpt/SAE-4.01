'use client'

import React, { useEffect } from 'react'
import ArtisantForm from '../components/ArtisanForm'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

/**
 * Page d'affectation des artisans aux étapes
 * Réservée aux maîtres d'œuvre pour affecter des artisans aux étapes des chantiers
 * @returns {JSX.Element} La page d'affectation des artisans
 */
export default function page() {

  return (
    <div className='Main'>
        <Nav/>
        <ArtisantForm/>
        <Footer/>
    </div>
  )
}
