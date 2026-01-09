'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Nav from '../components/Nav_commercial'
import Footer from '../components/Footer'
import ClientForm from '../components/ClientForm'
import '../css/creation_chantier.css'

/**
 * Page de création de chantier pour les commerciaux
 * Vérifie que l'utilisateur est bien un commercial avant d'afficher la page
 * @returns {JSX.Element} La page de création de chantier
 */
export default function page() {
  const router = useRouter();

  /**
   * Vérifie le rôle de l'utilisateur et redirige si ce n'est pas un commercial
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "commercial") {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="page-wrapper">
        <Nav/>
        <ClientForm/>
        <Footer/>
    </div>
  )
}
