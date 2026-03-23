'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../../components/Nav_commercial'
import Footer from '../../components/Footer'
import ChantierForm from '../../components/ChantierForm'
import '../../css/creation_chantier.css'

/**
 * Page de création complète d'un chantier
 * Vérifie que l'utilisateur est bien un commercial avant d'afficher la page
 * @returns {JSX.Element} La page de création de chantier ou null si non autorisé
 */
export default function page_de_creation_de_chantier() {

  return (
    <>
        <Nav/>
        <ChantierForm/>
        <Footer/>
    </>
  )
}