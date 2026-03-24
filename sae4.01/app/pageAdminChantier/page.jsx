'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Admin from '../components/AdminChantier'
import Nav_Admin from '../components/Nav_admin'
import Footer from "../components/Footer"

/**
 * Page de gestion des chantiers
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des chantiers ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <Admin/>
      <Footer/>
    </>
  )
}