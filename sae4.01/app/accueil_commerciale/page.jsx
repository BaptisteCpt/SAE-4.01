'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Footer from '../components/Footer'
import AccCommercial from '../components/AccCommercial'

/**
 * Page d'accueil pour les commerciaux
 * @returns {JSX.Element} La page d'accueil commercial ou null si non autorisé
 */
export default function page() {

  return (
    <div className="page-wrapper">
      <Nav_commercial/>
      <AccCommercial/>
      <Footer/>
    </div>
  )
}
