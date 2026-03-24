"use client";

import Nav from "../components/Nav_commercial";
import Footer from "../components/Footer";
import ClientForm from "../components/ClientForm";
import "../css/creation_chantier.css";

export default function PageClient({ login }) {
  return (
    <div className="page-wrapper">
      <Nav login={login} />
      <ClientForm />
      <Footer />
    </div>
  );
}
