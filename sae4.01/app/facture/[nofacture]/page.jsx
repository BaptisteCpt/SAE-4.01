"use client";

import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav_maitreO";
import Footer from "../../components/Footer";
import FactureDetail from "../../components/FactureDetail";
import styles from '../../css/facture.css'

export default function Page({ params }) {

  const resolvedParams =  React.use(params);

  return (
    <>
      <Nav />
      <FactureDetail nofacture={resolvedParams.nofacture} />
      <Footer />
    </>
  );
}
