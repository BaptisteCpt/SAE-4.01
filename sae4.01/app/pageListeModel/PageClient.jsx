"use client";

import "../css/admin-list.css";
import Nav_admin from "../components/Nav_admin";
import Liste from "../components/ListeModel";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_admin login={login} />
      <Liste />
      <Footer />
    </>
  );
}
