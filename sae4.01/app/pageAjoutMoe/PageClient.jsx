"use client";

import "../css/admin-list.css";
import AjoutMoe from "../components/AjoutMOE";
import Nav_Admin from "../components/Nav_admin";
import Footer from "../components/Footer";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_Admin login={login} />
      <AjoutMoe />
      <Footer />
    </>
  );
}
