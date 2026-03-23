"use client";

import React from "react";
import NavArtisan from "../components/Nav_artisan";
import GenererFactureArtisan from "../components/GenererFactureArtisan";
import Footer from "../components/Footer";

/**
 * Page de génération de facture artisan.
 * @returns {JSX.Element}
 */
export default function PageGenererFactureArtisan() {
  return (
    <div className="page-wrapper">
      <NavArtisan />
      <GenererFactureArtisan />
      <Footer />
    </div>
  );
}
