'use client' 

import "../css/admin-list.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'
import Nav_admin from '../components/Nav_admin'
import Liste from "../components/ListeModel"
import Footer from '../components/Footer'

export default function AccCommercial() { 

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
    <>
      <Nav_admin />
      <Liste/>
      <Footer/>
    </>
  )
} 