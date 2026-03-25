"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import SearchableSelect from "./SearchableSelect";

export default function ArtisanForm() {
  const [Chantiers, setChantiers] = useState([]);
  const [Factures, setFactures] = useState({});
  const [Etapes, setEtapes] = useState([]);
  const [numero_chantier, setNumeroChantier] = useState();
  const [error, setError] = useState("");

  const router = useRouter();

  useEffect(() => {
    async function fetchChantier() {
      try {
        const res = await fetch("/api/numero_chantier");
        const data = await res.json();
        setChantiers(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des chantiers", err);
        setError("Impossible de charger les chantiers.");
      }
    }

    fetchChantier();
  }, []);

  useEffect(() => {
    async function fetchEtapes() {
      if (!numero_chantier) {
        setEtapes([]);
        setFactures({});
        return;
      }

      try {
        const response = await fetch(`/api/etapes?chantier=${numero_chantier}`);
        const data = await response.json();

        if (response.ok) {
          setEtapes(data);
        } else {
          setEtapes([]);
        }

        setFactures({});
      } catch (err) {
        console.error(err);
        setEtapes([]);
      }
    }

    fetchEtapes();
  }, [numero_chantier]);

  useEffect(() => {
    if (!numero_chantier || Etapes.length === 0) {
      setFactures({});
      return;
    }

    async function fetchFactures() {
      try {
        const results = await Promise.all(
          Etapes.map(async (et) => {
            try {
              const response = await fetch(
                `/api/facture_by_chantier?num_chantier=${numero_chantier}&num_etape=${et.id}`
              );

              const data = await response.json();

              if (!response.ok || data == null) return null;
              return [et.id, data];
            } catch (err) {
              console.error(err);
              return null;
            }
          })
        );

        const factures = Object.fromEntries(results.filter(Boolean));
        setFactures(factures);
      } catch (err) {
        console.error(err);
      }
    }

    fetchFactures();
  }, [numero_chantier, Etapes]);

  return (
    <div className="factureArti">
      <div className="BulleFactureArti">
        <h1>Factures Des Artisans</h1>

        <div className="form-grid">
          <SearchableSelect
            options={Chantiers}
            value={numero_chantier}
            onChange={(value) => setNumeroChantier(Number(value))}
            getOptionValue={(chantier) => chantier.nochantier}
            getOptionLabel={(chantier) =>
              `${chantier.nochantier} - ${chantier.adressechantier}`
            }
            placeholder="Choisir un chantier..."
          />
        </div>

        {numero_chantier && (
          <>
            <hr />

            <div className="factures-grid">
              {Etapes.map((etape, index) => {
                const fac = Factures[etape.id];

                if (!fac) {
                  return (
                    <div key={etape.id ?? index} className="facture-card">
                      <h3 className="factures-title">
                        {etape.nom || etape.nometape || "Étape"}
                      </h3>

                      <div className="facture-content">
                        <p className="no-data">
                          Pas de facture pour cette étape.
                        </p>
                      </div>

                      <button
                        className="facture-button disabled-button"
                        disabled
                      >
                        Aucune facture
                      </button>
                    </div>
                  );
                }

                const etapechantier = fac.etape_chantier;
                const montantTheorique = Number(
                  etapechantier?.montanttheoriquefacture ?? 0
                );
                const montantReel = Number(fac?.montantfacture ?? 0);
                const ecartPrix = montantReel - montantTheorique;

                const margePourcent =
                  montantTheorique !== 0
                    ? ((ecartPrix / montantTheorique) * 100).toFixed(1)
                    : "0.0";

                const debutTheo = new Date(etapechantier?.datedebuttheorique);
                const debutReel = new Date(etapechantier?.datedebut);
                const finReel = new Date(etapechantier?.datefin);

                const retardDebut = Math.round(
                  (debutReel - debutTheo) / (1000 * 60 * 60 * 24)
                );

                const dureeReelle = Math.round(
                  (finReel - debutReel) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={etape.id} className="facture-card">
                    <h3 className="factures-title">
                      {etapechantier?.etape?.nometape?.trim() ||
                        etape.nom ||
                        etape.nometape ||
                        "Étape"}
                    </h3>

                    <div className="facture-content">
                      <h5>Infos de la facture n°{fac.nofacture} : </h5>
                      <p>
                        💰 Prix de départ :{" "}
                        {etapechantier.montanttheoriquefacture} €
                      </p>
                      <p>
                        💰 Réduction / Supplément :{" "}
                        {etapechantier.reducsuppl > 0 ? etapechantier.reducsuppl +"€" : "Pas de réduction ou supplément"}
                      </p>
                      <p>
                        📅 Démarrage théorique :{" "}
                        {debutTheo.toLocaleDateString("FR-fr", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p>🧑🏻‍🔧 artisan : {etapechantier.artisan.nomartisan} {etapechantier.artisan.prenomartisan}</p>
                      <h5>Anomalies repéré : </h5>
                      <p>
                        💰 Écart prix : {ecartPrix.toFixed(2)} € (
                        {margePourcent}%)
                      </p>
                      <p>
                        📅 Retard démarrage :{" "}
                        {retardDebut > 0
                          ? `+${retardDebut} jours`
                          : `${retardDebut} jours`}
                      </p>
                      <p>🕓 Durée réelle : {dureeReelle} jours</p>
                      <p>
                        📊 Résultat : {ecartPrix == 0 ? "pas d'écart de prix" : ecartPrix > 0 ? "Surcoût" : "Économie"}
                      </p>
                    </div>

                    <button
                      className="facture-button"
                      onClick={() => router.push(`/facture/${fac.nofacture}`)}
                    >
                      Voir facture
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {error && <p className="no-data global-error">{error}</p>}
      </div>
    </div>
  );
}
