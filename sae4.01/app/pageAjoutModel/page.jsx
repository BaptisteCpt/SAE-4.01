'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import AjoutModel from '../components/AjoutModel'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page d'ajout d'un nouveau modèle
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page d'ajout de modèle ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <AjoutModel/>
      <Footer/>
    </>
  )
}