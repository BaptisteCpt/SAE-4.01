'use client'

import "../css/admin-list.css"; 
import React, { useEffect, useState } from 'react'
import AjoutMoe from '../components/AjoutMOE'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page d'ajout d'un nouveau maître d'œuvre
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page d'ajout de maître d'œuvre ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <AjoutMoe/>
      <Footer/>
    </>
  )
}