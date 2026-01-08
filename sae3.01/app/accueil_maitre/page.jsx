'use client'

import React, { useEffect, useState } from 'react'
import Nav_maitreO from '../components/Nav_maitreO'
import AccMaitre from '../components/AccMaitre'
import Footer from '../components/Footer'
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
    <div className="page-wrapper">
      <Nav_maitreO />
      <AccMaitre />
      <Footer />
    </div>
  )
}
