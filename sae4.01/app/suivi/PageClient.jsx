"use client";

import Suivi from "../components/Suivi";
import Nav from "../components/Nav_maitreO";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <div className="page-wrapper">
      <Nav login={login} />
      <Suivi />
      <Footer />
    </div>
  );
}
