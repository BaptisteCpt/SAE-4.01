"use client";

import { Fragment, useEffect, useState } from "react";
import "../css/admin-list.css";

/**
 * Affiche les chantiers où l'artisan connecté est activé.
 * @returns {JSX.Element}
 */
export default function ListeChantiersArtisan() {
  const [chantiers, setChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedChantier, setExpandedChantier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchChantiersArtisan() {
      const login = localStorage.getItem("nom");
      if (!login) {
        setError("Impossible d'identifier l'utilisateur connecté.");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/chantiers_artisan_actifs?login=${encodeURIComponent(login)}`
        );
        const data = await res.json();

        if (!res.ok) {
          setError(data?.error || "Erreur lors de la récupération des chantiers.");
          setChantiers([]);
        } else {
          const listeTriee = Array.isArray(data)
            ? [...data].sort((a, b) => a.nochantier - b.nochantier)
            : [];
          setChantiers(listeTriee);
          setError("");
        }
      } catch (_error) {
        setError("Erreur réseau lors de la récupération des chantiers.");
        setChantiers([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchChantiersArtisan();
  }, []);

  function toggleChantier(nochantier) {
    setExpandedChantier((prev) => (prev === nochantier ? null : nochantier));
  }

  const chantiersFiltres = chantiers.filter((chantier) => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return true;

    const numero = String(chantier.nochantier || "");
    const adresse = String(chantier.adressechantier || "").toLowerCase();
    const ville = String(chantier.villechantier || "").toLowerCase();

    return (
      numero.includes(query) || adresse.includes(query) || ville.includes(query)
    );
  });

  return (
    <div className="bulle">
      <h1>Liste des chantiers</h1>

      <div style={{ maxWidth: "500px", margin: "0 auto 20px auto" }}>
        <input
          type="text"
          placeholder="Rechercher par n°, adresse ou ville..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading && <p>Chargement des chantiers...</p>}
      {!isLoading && error && <p>{error}</p>}

      {!isLoading && !error && chantiersFiltres.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>N°</th>
                <th>Adresse</th>
                <th>Ville</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {chantiersFiltres.map((chantier) => (
                <Fragment key={chantier.nochantier}>
                  <tr
                    onClick={() => toggleChantier(chantier.nochantier)}
                    style={{ cursor: "pointer" }}
                  >
                    <td data-label="">
                      {expandedChantier === chantier.nochantier ? "▼" : "▶"}
                    </td>
                    <td data-label="N°">{chantier.nochantier}</td>
                    <td data-label="Adresse">{chantier.adressechantier}</td>
                    <td data-label="Ville">
                      {chantier.villechantier} ({chantier.cpchantier})
                    </td>
                    <td data-label="Date">
                      {chantier.datecreation
                        ? new Date(chantier.datecreation).toLocaleDateString("fr-FR")
                        : "-"}
                    </td>
                  </tr>
                  {expandedChantier === chantier.nochantier && (
                    <tr>
                      <td colSpan={5} data-label="Étapes">
                        <strong>Étapes concernées :</strong>
                        <ul style={{ marginTop: "10px" }}>
                          {(chantier.etapes || []).map((etape) => (
                            <li key={`${chantier.nochantier}-${etape.noetape}`}>
                              Étape {etape.noetape} - {(etape.nometape || "").trim()} |{" "}
                              {etape.reservee ? "Réservée" : "Non réservée"}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && !error && chantiersFiltres.length === 0 && (
        <p className="Pdonner">Aucun chantier trouvé pour cette recherche.</p>
      )}
    </div>
  );
}
