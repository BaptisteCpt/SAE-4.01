"use client";

import React, { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

/**
 * Composant pour affecter un artisan à une étape d'un chantier
 * Permet de sélectionner un chantier, une étape non réservée, puis un artisan qualifié
 * @returns {JSX.Element} Le formulaire d'affectation d'artisan
 */
export default function artisanForm() {
  const [Chantiers, setChantiers] = useState([]);
  const [Factures, setFactures] = useState([]);
  const [Artisans, setArtisans] = useState([]);
  const [numero_chantier, setNumeroChantier] = useState();
  const [FactureCourrante, setFactureCourrante] = useState();
  const [ArtisanCourrant, setArtisanCourrant] = useState();
  const [error, setError] = useState();

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
          `/api/artisans?num_chantier=${numero_chantier}`,
        );
        const data = await response.json();
        if (response.ok) {
          setArtisans(data);
          setArtisanCourrant(data[0]);
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
      if (!ArtisanCourrant) return; // Ne fait rien si aucun chantier n'est sélectionné
      try {
        // Utilise un paramètre de requête pour filtrer par étape
        const response = await fetch(
          `/api/factures?num_artisan=${ArtisanCourrant}`,
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
    fetchfactures();
  }, [ArtisanCourrant]); // Se déclenche à chaque changement de numero_chantier

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
                Nom Artisan:
                <select
                  value={ArtisanCourrant}
                  onChange={(e) => setArtisanCourrant(Number(e.target.value))}
                >
                  {Artisans.map((artisan) => (
                    <option key={artisan.noartisan} value={artisan.noartisan}>
                      {artisan.noartisan} - {artisan.nomartisan} -{" "}
                      {artisan.prenomartisan}
                    </option>
                  ))}
                </select>
              </label>

              <hr />

              <div className="full-width">
                {ArtisanCourrant !== undefined ? (
                  <h1>Factures à afficher</h1>
                ) : (
                  <div className="no-data">Aucune facture disponible.</div>
                )}
              </div>
            </>
          )}
        </div>

        {error && <p className="no-data">{error}</p>}
      </div>
    </div>
  );
}
