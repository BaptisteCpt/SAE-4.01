"use client";

import "../css/admin-list.css";
import Nav_admin from "../components/Nav_admin";
import Modif from "../components/ModifModel";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_admin login={login} />
      <Modif />
      <Footer />
    </>
  );
}
