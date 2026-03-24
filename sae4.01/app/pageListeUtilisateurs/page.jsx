'use client' 

import "../css/accueil.css"; 
import "../css/admin-list.css";
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'
import Nav_admin from '../components/Nav_admin'
import EmployeForm from "../components/EmployeForm"
import Footer from "../components/Footer"

/**
 * Page de gestion des employés
 * Vérifie que l'utilisateur est bien un administrateur avant d'afficher la page
 * @returns {JSX.Element} La page de gestion des employés ou null si non autorisé
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
      <EmployeForm/>
      <Footer/>
    </>
  )
} 