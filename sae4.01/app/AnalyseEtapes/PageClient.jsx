"use client";

import Facture from "../components/AnalyseEtapes";
import Nav from "../components/Nav_maitreO";
import Footer from "../components/Footer";
import "../css/bench.css";

export default function PageClient({ login }) {
  return (
    <div className="Main">
      <Nav login={login} />
      <Facture />
      <Footer />
    </div>
  );
}
