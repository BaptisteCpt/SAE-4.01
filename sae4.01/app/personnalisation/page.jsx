'use client';
import Nav from '../components/Nav_maitreO';
import Footer from '../components/Footer'
import PersonnalisationContent from '../components/PersonnalisationContent';
import styles from '../css/personnalisation.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Page de personnalisation des étapes d'un chantier
 * Réservée aux maîtres d'œuvre pour personnaliser les étapes
 * @returns {JSX.Element} La page de personnalisation
 */
export default function PersonnalisationPage() {

  return (
    <div className="page-wrapper">
        <Nav />
        <PersonnalisationContent />
        <Footer/>
    </div>
  );
}
