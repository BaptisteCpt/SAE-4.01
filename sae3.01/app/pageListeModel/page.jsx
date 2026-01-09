'use client' 

import "../css/admin-list.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'
import Nav_admin from '../components/Nav_admin'
import Liste from "../components/ListeModel"
import Footer from '../components/Footer'

/**
 * Page de liste des modèles
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de liste des modèles ou null si non autorisé
 */
export default function AccCommercial() { 

  const router = useRouter();
  const [authorized, setAuthorized] = useState(false); 
  const [nom, setNom] = useState("");

  /**
   * Vérifie le rôle de l'utilisateur et autorise l'accès si c'est un administrateur
   */
  useEffect(() => {
    const role = localStorage.getItem("role");
    const nomStocke = localStorage.getItem("nom");

 
    if (role === "admin") {
      setAuthorized(true);
      setNom(nomStocke);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <>
      <Nav_admin />
      <Liste/>
      <Footer/>
    </>
  )
} 