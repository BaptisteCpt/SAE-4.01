'use client'

import "../css/admin-list.css";
import React, { useEffect, useState } from 'react'
import ModifCommercial from '../components/ModifCommercial'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page de modification d'un commercial
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification de commercial ou null si non autorisé
 */
export default function page() {
  return (
    <>
      <Nav_Admin/>
      <ModifCommercial/>
      <Footer/>
    </>
  )
}
