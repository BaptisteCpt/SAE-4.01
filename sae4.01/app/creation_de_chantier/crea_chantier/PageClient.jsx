"use client";

import Nav from "../../components/Nav_commercial";
import Footer from "../../components/Footer";
import ChantierForm from "../../components/ChantierForm";
import "../../css/creation_chantier.css";

export default function PageClient({ login }) {
  return (
    <>
      <Nav login={login} />
      <ChantierForm />
      <Footer />
    </>
  );
}
