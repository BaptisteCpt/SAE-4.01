'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Liste from '../components/ListeAdmin'
import Nav_Admin from '../components/Nav_admin'
import Footer from'../components/Footer'

/**
 * Page de liste des administrateurs
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de liste des administrateurs ou null si non autorisé
 */
export default function page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un administrateur
   */


  if (!authorized) {
    return null;
  }

  return (
    <>
      <Nav_Admin/>
      <Liste/>
      <Footer/>
    </>
  )
}