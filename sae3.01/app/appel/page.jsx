'use client'

import React, { useEffect } from 'react'
import Appel from '../components/Appel'
import Nav from '../components/Nav_maitreO'
import Footer from '../components/Footer'
import { useRouter } from 'next/navigation'

export default function page() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "maitre Oeuvre") {
      router.push('/');
    }
  }, [router]);

  return (
    <div className='Main'>
        <Nav/>
        <Appel/>
        <Footer/>
    </div>
  )
}