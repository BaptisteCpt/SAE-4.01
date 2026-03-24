'use client'

import "../css/admin-list.css";
import React, { useEffect, useState } from 'react'
import ModifAdmin from '../components/ModifAdmin'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page de modification d'un administrateur
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification d'administrateur ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <ModifAdmin/>
      <Footer/>
    </>
  )
}
