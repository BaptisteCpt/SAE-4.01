"use client";

import React, { useEffect, useState } from "react";
import Nav from "../../components/Nav_maitreO";
import Footer from "../../components/Footer";
import FactureDetail from "../../components/FactureDetail";
import styles from '../../css/facture.css'
import { useRouter } from "next/navigation";

export default function Page({ params }) {
  const router = useRouter();
  
  useEffect(() => {
    const role = localStorage.getItem("role");

    if (role !== "maitre Oeuvre") {
      router.push("/");
    }
  }, [router]);

  const resolvedParams =  React.use(params);

  return (
    <>
      <Nav />
      <FactureDetail nofacture={resolvedParams.nofacture} />
      <Footer />
    </>
  );
}
