"use client";

import ListeModel from "../components/ListeModel";
import Nav_Admin from "../components/Nav_admin";

export default function PageClient({ login }) {
  return (
    <>
      <Nav_Admin login={login} />
      <ListeModel />
    </>
  );
}
