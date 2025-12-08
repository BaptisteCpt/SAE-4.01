'use client';
import Nav from '../components/Nav_maitreO';
// On importe le gros fichier unique qui contient tout
import PersonnalisationContent from '../components/PersonnalisationContent';

export default function PersonnalisationPage() {
  return (
    <div>
        <Nav />
        <PersonnalisationContent />
    </div>
  );
}