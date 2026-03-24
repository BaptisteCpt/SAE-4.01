"use client";

import NavArtisan from "../../components/Nav_artisan";
import Footer from "../../components/Footer";
import FactureDetail from "../../components/FactureDetail";

/**
 * Consultation d'une facture artisan (hors route /facture réservée au maître d'œuvre).
 */
export default function VoirFactureArtisan({ login, nofacture }) {
  return (
    <div className="page-wrapper">
      <NavArtisan login={login} />
      <FactureDetail nofacture={nofacture} />
      <Footer />
    </div>
  );
}
