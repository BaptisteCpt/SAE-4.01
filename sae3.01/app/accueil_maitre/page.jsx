'use client'

import React, { useEffect, useState } from 'react'
import Nav_maitreO from '../components/Nav_maitreO'
import styles from '../css/accueil.css'
import { useRouter } from 'next/navigation'

export default function PageMaitreOeuvre() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false); 
  const [nom, setNom] = useState("");

  useEffect(() => {
    const role = localStorage.getItem("role");
    const nomStocke = localStorage.getItem("nom");

    if (role === "maitre Oeuvre") {
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
      <Nav_maitreO />

      <div id="accueil_body">
        <div className="bulle_accueil">
            <h1>Bonjour { nom }</h1>
        </div>
      </div>
    </>
  )
}