"use client";

import "../css/admin-list.css";
import AjoutModel from "../components/AjoutModel";
import Nav_Admin from "../components/Nav_admin";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_Admin login={login} />
      <AjoutModel />
      <Footer />
    </>
  );
}
