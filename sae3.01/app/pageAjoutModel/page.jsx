'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AjoutModel from '../components/AjoutModel'
import Nav_Admin from '../components/Nav_admin'
import Footer from '../components/Footer'

export default function page() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setAuthorized(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!authorized) {
    return null;
  }

  return (
    <>
      <Nav_Admin/>
      <AjoutModel/>
      <Footer/>
    </>
  )
}