"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import SearchableSelect from "./SearchableSelect";

/**
 * Composant pour affecter un artisan à une étape d'un chantier
 * Permet de sélectionner un chantier, une étape non réservée, puis un artisan qualifié
 * @returns {JSX.Element} Le formulaire d'affectation d'artisan
 */
export default function artisanForm() {
  const [Chantiers, setChantiers] = useState([]);
  const [Factures, setFactures] = useState({});
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
  useEffect(() => {
    if (!numero_chantier || Etapes.length === 0) return;

    async function fetchfactures() {
      // Promise.all pour attendre tous les fetch
      const results = await Promise.all(
        Etapes.map(async (et) => {
          try {
            const response = await fetch(
              `/api/facture_by_chantier?num_chantier=${numero_chantier}&num_etape=${et.id}`,
            );
            const data = await response.json();
            if (!response.ok || data == null) return null;
            return [et.id, data];
          } catch (err) {
            console.error(err);
            return null;
          }
        }),
      );

      // Reconstruction du dictionnaire après résolution de toutes les promesses
      const factures = Object.fromEntries(results.filter(Boolean));
      console.log(factures);
      setFactures(factures);
    }

    fetchfactures();
  }, [Etapes]); // Se déclenche à chaque changement de etapes

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

          {numero_chantier && (
            <>
              <hr />

              {Etapes.map((etape, index) => {
                const fac = Factures[etape.id];

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
                  etapechantier.montanttheoriquefacture,
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
                  (debutReel - debutTheo) / (1000 * 60 * 60 * 24),
                );
                const dureeReelle = Math.round(
                  (finReel - debutReel) / (1000 * 60 * 60 * 24),
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
