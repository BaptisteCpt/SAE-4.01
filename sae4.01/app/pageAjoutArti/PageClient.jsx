"use client";

import "../css/admin-list.css";
import AjoutArtisan from "../components/AjoutArtisan";
import Nav_Admin from "../components/Nav_admin";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_Admin login={login} />
      <AjoutArtisan />
      <Footer />
    </>
  );
}
