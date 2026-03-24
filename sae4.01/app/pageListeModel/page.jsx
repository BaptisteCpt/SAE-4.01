'use client' 

import "../css/admin-list.css"; 
import { useState, useEffect } from 'react' 
import Nav_admin from '../components/Nav_admin'
import Liste from "../components/ListeModel"
import Footer from '../components/Footer'

/**
 * Page de liste des modèles
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de liste des modèles ou null si non autorisé
 */
export default function AccCommercial() { 

  return (
    <>
      <Nav_admin />
      <Liste/>
      <Footer/>
    </>
  )
} 