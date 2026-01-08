'use client'

import React, { useEffect, useState } from 'react'
import Nav_commercial from '../components/Nav_commercial'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'
import AccCommercial from '../components/AccCommercial'

export default function page() {
  const router = useRouter();
  const [acces, setAccess] = useState(false);
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role === "commercial") {
      setAccess(true);
    } else {
      router.push('/');
    }
  }, [router]);
  if (!acces) {
    return null; 
  }

  return (
    <div className="page-wrapper">
      <Nav_commercial/>
      <AccCommercial/>
      <Footer/>
    </div>
  )
}
