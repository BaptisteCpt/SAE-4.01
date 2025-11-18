'use client'

import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import styles from '../css/accueil.css'

export default function page() {
  const [role, setRole] = useState("")

  useEffect(() => {
    const loginStored = localStorage.getItem("login")
    setRole(loginStored || "")
  }, [])

  return (
    <>
      <Nav/>
      <div id="accueil_body">
        <h1>Bonjour { role }</h1>
      </div>
    </>
  )
}
