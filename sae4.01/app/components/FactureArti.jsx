"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

/**
 * Composant pour affecter un artisan à une étape d'un chantier
 * Permet de sélectionner un chantier, une étape non réservée, puis un artisan qualifié
 * @returns {JSX.Element} Le formulaire d'affectation d'artisan
 */
export default function artisanForm() {
  const [Chantiers, setChantiers] = useState([]);
  const [Factures, setFactures] = useState([]);
  const [Etapes, setEtapes] = useState([]);
  const [numero_chantier, setNumeroChantier] = useState();
  const [error, setError] = useState();

  const router = useRouter();
  /**
   * Charge la liste des chantiers au chargement du composant
   * Vérifie aussi si un chantier et une étape ont été sauvegardés dans le localStorage
   */
  useEffect(() => {
    /**
     * Récupère la liste de tous les chantiers depuis l'API
     */
    async function fetchChantier() {
      try {
        const res = await fetch("/api/numero_chantier");
        const model = await res.json();
        setChantiers(model);
      } catch (err) {
        console.error("Erreur lors de la récuperation des chantiers", err);
      }
    }
    fetchChantier();
  }, []);

  /**
   * Charge les étapes non réservées du chantier sélectionné
   * Filtre pour n'afficher que les étapes disponibles (non réservées)
   * Sélectionne automatiquement la première étape si disponible
   */
  useEffect(() => {
    /**
     * Récupère les étapes du chantier et filtre pour ne garder que celles non réservées
     */
    async function fetchEtapes() {
      if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
      try {
        const response = await fetch(`/api/etapes?chantier=${numero_chantier}`);
        const data = await response.json();
        if (response.ok) {
          setEtapes(data);
        } else {
          setEtapes([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchEtapes();
  }, [numero_chantier]); // Se déclenche à chaque changement de numero_chantier

  /**
   * Récupère les factures depuis l'API
   */
  async function fetchfactures(netape) {
    if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
    try {
      const response = await fetch(
        `/api/factures_by_chantier?num_chantier=${numero_chantier}&num_etape=${netape}`
      );
      const data = await response.json();
      if (response.ok) {
        setFactures(data);
      } else {
        setFactures([]);
      }
    } catch (err) {
      console.error(err);
    }
  }
  return (
    <div className="factureArti">
      <div className="BulleFactureArti">
        <h1>Factures Des Artisans</h1>

        <div className="form-grid">
          <label className="full-width">
            Chantier Choisi :
            <select
              value={numero_chantier}
              onChange={(e) => {
                setNumeroChantier(Number(e.target.value));
              }}
            >
              <option value="" hidden>
                -- Sélectionnez un chantier --
              </option>
              {Chantiers.map((Chantier) => (
                <option key={Chantier.nochantier} value={Chantier.nochantier}>
                  {Chantier.nochantier} - {Chantier.adressechantier}
                </option>
              ))}
            </select>
          </label>

          {numero_chantier && (
            <>
              <hr />

              {Etapes.map((etape, index) => {
                const fac = Factures.find(
                  (f) => f.etape_chantier.noetape === etape.id
                );

                if (!fac) {
                  return (
                    <div key={index} className="facture-card">
                      <h3 className="factures-title">{etape.nom}</h3>
                      <p className="no-data">
                        Pas de facture pour cette étape.
                      </p>
                    </div>
                  );
                }

                const etapechantier = fac.etape_chantier;
                const montantTheorique = Number(
                  etapechantier.montanttheoriquefacture
                );
                const montantReel = Number(fac.montantfacture);
                const ecartPrix = montantReel - montantTheorique;
                const margePourcent = (
                  (ecartPrix / montantTheorique) *
                  100
                ).toFixed(1);

                const debutTheo = new Date(etapechantier.datedebuttheorique);
                const debutReel = new Date(etapechantier.datedebut);
                const finReel = new Date(etapechantier.datefin);
                const retardDebut = Math.round(
                  (debutReel - debutTheo) / (1000 * 60 * 60 * 24)
                );
                const dureeReelle = Math.round(
                  (finReel - debutReel) / (1000 * 60 * 60 * 24)
                );

                return (
                  <div key={fac.nofacture} className="factures-grid">
                    <div className="facture-card">
                      <h3 className="factures-title">
                        {etapechantier.etape.nometape.trim()}
                      </h3>
                      <div className="facture-content">
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
                          📊 Résultat :{" "}
                          {ecartPrix >= 0 ? "Surcoût" : "Économie"}
                        </p>
                      </div>
                      <button
                        className="facture-button"
                        onClick={() => router.push(`/facture/${fac.nofacture}`)}
                      >
                        Voir facture
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
        {error && <p className="no-data">{error}</p>}
      </div>
    </div>
  );
}
