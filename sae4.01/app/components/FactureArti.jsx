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
  const [Artisans, setArtisans] = useState([]);
  const [Etapes, setEtapes] = useState([]);
  const [numero_chantier, setNumeroChantier] = useState();
  const [FactureCourrante, setFactureCourrante] = useState();
  const [ArtisanCourrant, setArtisanCourrant] = useState();
  const [EtapeCourrante, setEtapeCourrante] = useState();
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
          // Sélectionne automatiquement la première étape disponible pour faciliter l'utilisation
          if (data.length > 0) setEtapeCourrante(data[0].id);
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
   * Charge les artisans
   * Se déclenche automatiquement quand un chantier est sélectionné
   */
  useEffect(() => {
    /**
     * Récupère les artisans depuis l'API
     */
    async function fetchartisan() {
      if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
      try {
        // Utilise un paramètre de requête pour filtrer par étape
        const response = await fetch(
          `/api/artisans?num_chantier=${numero_chantier}`
        );
        const data = await response.json();
        if (response.ok) {
          setArtisans(data);
          setArtisanCourrant(data[0].noartisan);
        } else {
          setArtisans([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchartisan();
  }, [numero_chantier]); // Se déclenche à chaque changement de numero_chantier

  /**
   * Charge les factures d'un artisan
   * Se déclenche automatiquement quand un artisan est sélectionné
   */
  useEffect(() => {
    /**
     * Récupère les factures depuis l'API
     */
    async function fetchfactures() {
      if (!ArtisanCourrant) return; // Ne fait rien si aucun artisan n'est sélectionné
      try {
        // Utilise un paramètre de requête pour filtrer par étape
        const response = await fetch(
          `/api/factures_by_artisan?num_artisan=${ArtisanCourrant}&num_chantier=${numero_chantier}`
        );
        const data = await response.json();
        if (response.ok) {
          setFactures(data);
          setFactureCourrante(data[0]);
        } else {
          setFactures([]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchfactures();
  }, [ArtisanCourrant]); // Se déclenche à chaque changement de numero_artisan

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
              <label className="full-width">
                Etape :
                <select
                  value={EtapeCourrante}
                  onChange={(e) => setEtapeCourrante(Number(e.target.value))}
                >
                  {Etapes.map((etape) => (
                    <option key={etape.id} value={etape.id}>
                      {etape.id} - {etape.nom}
                    </option>
                  ))}
                </select>
              </label>

              <hr />
              {EtapeCourrante !== undefined && (
                <>
                  {Factures.map((fac) => {
                    if (fac.etape_chantier.noetape == EtapeCourrante) {
                      const etapechantier = fac.etape_chantier;

                      // Diff des prix
                      const montantTheorique = Number(
                        etapechantier.montanttheoriquefacture
                      );
                      const montantReel = Number(fac.montantfacture);
                      const ecartPrix = montantReel - montantTheorique;
                      const margePourcent = (
                        (ecartPrix / montantTheorique) *
                        100
                      ).toFixed(1);

                      // diff des délais
                      const debutTheo = new Date(
                        etapechantier.datedebuttheorique
                      );
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
                              onClick={() =>
                                router.push(`/facture/${fac.nofacture}`)
                              }
                            >
                              Voir facture
                            </button>
                          </div>
                        </div>
                      );
                    } else {
                      return (
                        <div key={EtapeCourrante} className="no-data">
                          Facture indisponible pour cette étape.
                        </div>
                      );
                    }
                  })}
                </>
              )}
            </>
          )}
        </div>

        {error && <p className="no-data">{error}</p>}
      </div>
    </div>
  );
}
