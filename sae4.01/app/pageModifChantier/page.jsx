'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Modif from '../components/AdminModifChantier'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page de modification d'un chantier
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification de chantier ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <Modif/>
      <Footer/>
    </>
  )
}