"use client";

import Nav from "../../components/Nav_maitreO";
import Footer from "../../components/Footer";
import FactureDetail from "../../components/FactureDetail";

export default function PageClient({ login, nofacture }) {
  return (
    <>
      <Nav login={login} />
      <FactureDetail nofacture={nofacture} />
      <Footer />
    </>
  );
}
