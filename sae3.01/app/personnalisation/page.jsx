'use client';
import Nav from '../components/Nav_maitreO';
import Footer from '../components/Footer'
import PersonnalisationContent from '../components/PersonnalisationContent';
import styles from '../css/personnalisation.css'

export default function PersonnalisationPage() {
  return (
    <div className="page-wrapper">
        <Nav />
        <PersonnalisationContent />
        <Footer/>
    </div>
  );
}
