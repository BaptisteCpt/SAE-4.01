'use client';
import Nav from '../components/Nav_maitreO';
import Footer from '../components/Footer'
import PersonnalisationContent from '../components/PersonnalisationContent';
import styles from '../css/personnalisation.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PersonnalisationPage() {
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "maitre Oeuvre") {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="page-wrapper">
        <Nav />
        <PersonnalisationContent />
        <Footer/>
    </div>
  );
}
