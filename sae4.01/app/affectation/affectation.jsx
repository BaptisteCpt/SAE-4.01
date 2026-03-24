"use client";

import ArtisantForm from "../components/ArtisanForm";
import Nav from "../components/Nav_maitreO";
import Footer from "../components/Footer";

export default function affectation({ login }) {
  return (
    <div className="Main">
      <Nav login={login} />
      <ArtisantForm />
      <Footer />
    </div>
  );
}
