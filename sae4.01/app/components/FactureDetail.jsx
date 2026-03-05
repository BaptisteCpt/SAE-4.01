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
        setLoading(false);
      } catch (err) {
        console.error("Erreur lors de la récuperation de la facture", err);
      }
    }
    fetchFacture();
  }, [nofacture]);

  if (loading) return <p>Chargement...</p>;

  if (!facture || facture.error) {
    return <p>Facture introuvable</p>;
  }

  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="facture-wrapper">
      <div className="facture">
        <div className="facture-header">
          <div>
            <h1>FACTURE</h1>
            <p>
              <strong>N° :</strong> {facture.nofacture}
            </p>
            <p>
              <strong>Date :</strong>{" "}
              {new Date(facture.datefacture).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <div className="facture-meta">
            <p>
              <strong>Chantier n°{facture.nochantier} :</strong>{" "}
              {facture.etape_chantier.chantier.adressechantier.split(" ")[0] +
                " " +
                facture.etape_chantier.chantier.adressechantier.split(" ")[1] +
                " " +
                facture.etape_chantier.chantier.adressechantier.split(" ")[2]}
              , {facture.etape_chantier.chantier.cpchantier}{" "}
              {facture.etape_chantier.chantier.villechantier}
            </p>
            <p>
              <strong>Étape :</strong>{" "}
              {facture.etape_chantier?.etape?.nometape?.trim()}
            </p>
          </div>
        </div>

        <table className="facture-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Nb jours</th>
              <th>Numéro étape</th>
              <th>Montant (€)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Étape {facture.etape_chantier?.etape?.nometape?.trim()}</td>
              <td>{facture.nbjourstravail}</td>
              <td>{facture.noetape ?? "-"}</td>
              <td>{Number(facture.montantfacture).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <div className="facture-total">
          <h2>Total TTC : {Number(facture.montantfacture).toFixed(2)} €</h2>
        </div>

        <div className="facture-reglement">
          <p>
            <strong>Date de règlement :</strong>{" "}
            {facture.dateReglfacture
              ? new Date(facture.dateReglfacture).toLocaleDateString("fr-FR")
              : "Non réglée"}
          </p>
        </div>
      </div>

      <div className="no-print actions">
        <button onClick={handleDownload} className="btn-download">
          Télécharger la facture (PDF)
        </button>
      </div>
    </div>
  );
}
