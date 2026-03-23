'use client'

import React, { useEffect, useState } from 'react'
import Nav_maitreO from '../components/Nav_maitreO'
import AccMaitre from '../components/AccMaitre'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

/**
 * Page d'accueil pour les maîtres d'œuvre
 * @returns {JSX.Element} La page d'accueil maître d'œuvre ou null si non autorisé
 */
export default function PageMaitreOeuvre() {

  return (
    <div className="page-wrapper">
      <Nav_maitreO />
      <AccMaitre />
      <Footer />
    </div>
  )
}
