"use client";

import { useEffect, useState } from "react";
import "../css/facture.css";

export default function FactureDetail({ nofacture }) {
  const [facture, setFacture] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchFacture() {
      setLoading(true);
      const num = encodeURIComponent(String(nofacture ?? "").trim());
      try {
        const res = await fetch(`/api/factures_by_num?nofacture=${num}`, {
          credentials: "include",
        });
        const model = await res.json();
        if (!cancelled) {
          setFacture(model);
        }
      } catch (err) {
        console.error("Erreur lors de la récuperation de la facture", err);
        if (!cancelled) {
          setFacture({ error: "Erreur réseau" });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    if (nofacture == null || String(nofacture).trim() === "") {
      setFacture({ error: "Numéro de facture manquant" });
      setLoading(false);
      return undefined;
    }
    fetchFacture();
    return () => {
      cancelled = true;
    };
  }, [nofacture]);

  if (loading) {
    return (
      <div className="facture-wrapper">
        <p style={{ textAlign: "center", padding: "2rem" }}>Chargement...</p>
      </div>
    );
  }

  if (!facture || facture.error) {
    const msg =
      facture?.error === "Interdit"
        ? "Accès refusé à cette facture."
        : facture?.error === "Non authentifié"
          ? "Session expirée : reconnectez-vous."
          : "Facture introuvable.";
    return (
      <div className="facture-wrapper">
        <p style={{ textAlign: "center", padding: "2rem" }}>{msg}</p>
      </div>
    );
  }

  const chantier = facture.etape_chantier?.chantier;
  const adresseBrute = chantier?.adressechantier
    ? String(chantier.adressechantier).trim()
    : "";
  const adresseFormatee = adresseBrute || "—";

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
              {facture.datefacture
                ? new Date(facture.datefacture).toLocaleDateString("fr-FR")
                : "—"}
            </p>
          </div>

          <div className="facture-meta">
            <p>
              <strong>Chantier n°{facture.nochantier} :</strong>{" "}
              {adresseFormatee}
              {chantier
                ? `, ${chantier.cpchantier} ${chantier.villechantier}`
                : ""}
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
            {facture.datereglfacture
              ? new Date(facture.datereglfacture).toLocaleDateString("fr-FR")
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
