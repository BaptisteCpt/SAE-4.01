'use client'

import React, { useEffect, useState } from 'react'
import ListeModel from '../components/ListeModel'
import Nav_Admin from '../components/Nav_admin'

/**
 * Page de gestion des modèles
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des modèles ou null si non autorisé
 */
export default function page() {

  return (
    <>
      <Nav_Admin/>
      <ListeModel/>
    </>
  )
}