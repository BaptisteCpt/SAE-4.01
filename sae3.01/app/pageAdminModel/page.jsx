'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ListeModel from '../components/ListeModel'
import Nav_Admin from '../components/Nav_admin'

/**
 * Page de gestion des modèles
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des modèles ou null si non autorisé
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
      <ListeModel/>
    </>
  )
}