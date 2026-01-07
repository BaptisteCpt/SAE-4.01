'use client'

import React, { useEffect, useState } from 'react'
import Nav_admin from '../components/Nav_admin'
import Footer from '../components/Footer'
import styles from '../css/accueil.css'
import { useRouter } from 'next/navigation'
import AccAdmin from '../components/AccAdmin'

export default function PageAdmin() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false); 
  const [nom, setNom] = useState("");

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
    <div className="page-wrapper">
      <Nav_admin />
      <AccAdmin/>
      <Footer />
    </div>
  )
}
