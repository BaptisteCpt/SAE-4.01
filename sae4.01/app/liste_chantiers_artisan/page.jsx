"use client";

import React from "react";
import NavArtisan from "../components/Nav_artisan";
import ListeChantiersArtisan from "../components/ListeChantiersArtisan";
import Footer from "../components/Footer";

/**
 * Page listant les chantiers actifs de l'artisan.
 * @returns {JSX.Element}
 */
export default function PageListeChantiersArtisan() {
  return (
    <div className="page-wrapper">
      <NavArtisan />
      <ListeChantiersArtisan />
      <Footer />
    </div>
  );
}
