"use client";

import { useEffect, useState } from "react";
import "../css/admin-list.css";

/**
 * Affiche les chantiers où l'artisan connecté est activé.
 * @returns {JSX.Element}
 */
export default function ListeChantiersArtisan() {
  const [chantiers, setChantiers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTousLesChantiers() {
      try {
        const res = await fetch("/api/recup_chantier");
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

    fetchTousLesChantiers();
  }, []);

  return (
    <div className="bulle">
      <h1>Liste des chantiers</h1>

      {isLoading && <p>Chargement des chantiers...</p>}
      {!isLoading && error && <p>{error}</p>}

      {!isLoading && !error && chantiers.length > 0 && (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>N°</th>
                <th>Adresse</th>
                <th>Ville</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {chantiers.map((chantier) => (
                <tr key={chantier.nochantier}>
                  <td data-label="N°">{chantier.nochantier}</td>
                  <td data-label="Adresse">{chantier.adressechantier}</td>
                  <td data-label="Ville">
                    {chantier.villechantier.toUpperCase()} ({chantier.cpchantier})
                    
                  </td>
                  <td data-label="Date">
                    {chantier.datecreation
                      ? new Date(chantier.datecreation).toLocaleDateString("fr-FR")
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {!isLoading && !error && chantiers.length === 0 && (
        <p className="Pdonner">Aucun chantier trouvé.</p>
      )}
    </div>
  );
}
