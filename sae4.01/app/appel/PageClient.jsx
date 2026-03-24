"use client";

import Appel from "../components/Appel";
import Nav from "../components/Nav_maitreO";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <div className="Main">
      <Nav login={login} />
      <Appel />
      <Footer />
    </div>
  );
}
