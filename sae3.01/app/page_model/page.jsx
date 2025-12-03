'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Nav_admin from '../components/Nav_admin'
import styles from '../css/ListeMaquette.css'
import PModel from '../components/PModel'
import { useRouter } from 'next/navigation'

export default function page() {
  const [navBar, setNavBar] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "commercial") {
      setNavBar(<Nav_commercial/>);
    } else if(role === "admin") {
      setNavBar(<Nav_admin/>);
    }
  }, []);

  return (
    <>
      { navBar } 
      <PModel/>
    </>
  )
}