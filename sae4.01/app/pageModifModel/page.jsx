'use client' 
import "../css/admin-list.css"; 
import { useState, useEffect } from 'react' 
import Nav_admin from '../components/Nav_admin'
import Modif from "../components/ModifModel"
import Footer from '../components/Footer'


/**
 * Page de modification d'un modèle
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de modification de modèle ou null si non autorisé
 */
export default function AccCommercial() { 

  return (
    <>
      <Nav_admin />
      <Modif/>
      <Footer/>
    </>
  )
} 