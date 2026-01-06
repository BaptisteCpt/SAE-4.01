'use client';
import Nav from '../components/Nav_maitreO';
import Footer from '../components/Footer'
// On importe le gros fichier unique qui contient tout
import PersonnalisationContent from '../components/PersonnalisationContent';

export default function PersonnalisationPage() {
  return (
    <div>
        <Nav />
        <PersonnalisationContent />
        <Footer/>
    </div>
  );
}