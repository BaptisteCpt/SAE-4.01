"use client";

import Nav from "../components/Nav_maitreO";
import Footer from "../components/Footer";
import PersonnalisationContent from "../components/PersonnalisationContent";
import "../css/personnalisation.css";

export default function PageClient({ login }) {
  return (
    <div className="page-wrapper">
      <Nav login={login} />
      <PersonnalisationContent />
      <Footer />
    </div>
  );
}
