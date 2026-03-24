'use client'

import "../css/admin-list.css";
import React, { useEffect, useState } from 'react'
import AjoutArtisan from '../components/AjoutArtisan'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page de modification d'un artisan
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification d'artisan ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <AjoutArtisan/>
      <Footer/>
    </>
  )
}
