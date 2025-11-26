'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Nav_admin from '../components/Nav_admin'
import Nav_maitreO from '../components/Nav_maitreO'
import styles from '../css/accueil.css'
import { useRouter } from 'next/navigation'

export default function page() {
  const role = localStorage.getItem("role");
  const nom = localStorage.getItem("nom");
  const router = useRouter();

  let nav = null;

  if(role == "admin") {
    nav = <Nav_admin />
  }
  else if(role == "commercial") {
    nav = <Nav_commercial/>
  }
  else if(role == "maitre Oeuvre") {
    nav = <Nav_maitreO/>
  }
  else {
    router.push('/');
  }

  return (
    <>
      { nav }
      <div id="accueil_body">
        <h1>Bonjour { nom }</h1>
      </div>
    </>
  )
}
