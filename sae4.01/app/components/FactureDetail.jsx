"use client";

import { useEffect, useState } from "react";

export default function FactureDetail({ nofacture }) {
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFacture() {
      try {
        const res = await fetch(`/api/factures_by_num?nofacture=${nofacture}`);
        const model = await res.json();
        setFacture(model);
      } catch (err) {
        console.error("Erreur lors de la récuperation de la facture", err);
      }
    }
    fetchFacture();
  }, [nofacture]);

  if (loading) return <p>Chargement...</p>

  if (!facture || facture.error) {
    return <p>Facture introuvable</p>
  }

  return (
    <div>
      <h1>Facture #{facture.nofacture}</h1>
      <p>Étape : {facture.etape_chantier.etape.nometape.trim()}</p>
      <p>Montant : {Number(facture.montantfacture).toFixed(2)} €</p>
      <p>Date : {new Date(facture.datefacture).toLocaleDateString("fr-FR")}</p>
    </div>
  );
}
