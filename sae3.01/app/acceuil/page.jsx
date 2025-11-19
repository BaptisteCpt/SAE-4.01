'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Nav_admin from '../components/Nav_admin'
import Nav_maitreO from '../components/Nav_maitreO'
import styles from '../css/accueil.css'

export default function page() {
  const [role, setRole] = useState("")
  let nav = null;

  useEffect(() => {
    const loginStored = localStorage.getItem("login")
    setRole(loginStored || "")
  }, [])

  if(role == "admin") {
    nav = <Nav_admin />
  }

  if(role == "commercial") {
    nav = <Nav_commercial/>
  }

  if(role == "maitreO") {
    nav = <Nav_maitreO/>
  }

  return (
    <>
      { nav }
      <div id="accueil_body">
        <h1>Bonjour { role }</h1>
      </div>
    </>
  )
}
