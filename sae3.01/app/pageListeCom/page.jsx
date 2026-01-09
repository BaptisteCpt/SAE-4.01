'use client'

import "../css/admin-list.css";
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Liste from '../components/ListeCommercial'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

/**
 * Page de liste des commerciaux
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de liste des commerciaux ou null si non autorisé
 */
export default function page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un administrateur
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setAuthorized(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <>
      <Nav_Admin/>
      <Liste/>
      <Footer/>
    </>
  )
}