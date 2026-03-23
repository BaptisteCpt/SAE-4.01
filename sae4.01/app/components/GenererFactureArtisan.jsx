"use client";

import { useEffect, useMemo, useState } from "react";
import SearchableSelect from "./SearchableSelect";
import "../css/artisan.css";
import Swal from "sweetalert2";

/**
 * Formulaire de génération de facture artisan.
 * @returns {JSX.Element}
 */
export default function GenererFactureArtisan() {
  const [login, setLogin] = useState("");
  const [chantiers, setChantiers] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [nochantier, setNochantier] = useState("");
  const [noetape, setNoetape] = useState("");
  const [datefacture, setDatefacture] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [montantfacture, setMontantfacture] = useState("");
  const [nbjourstravail, setNbjourstravail] = useState("");

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: message,
      confirmButtonText: "OK",
    });
  }

  useEffect(() => {
    const loginStocke = localStorage.getItem("nom") || "";
    setLogin(loginStocke);
  }, []);

  useEffect(() => {
    async function fetchChantiers() {
      if (!login) return;
      try {
        const res = await fetch(
          `/api/chantiers_artisan_actifs?login=${encodeURIComponent(login)}`
        );
        const data = await res.json();
        if (!res.ok) {
          showError("Erreur serveur");
          setChantiers([]);
          return;
        }
        setChantiers(Array.isArray(data) ? data : []);
      } catch (_error) {
        showError("Erreur serveur");
        setChantiers([]);
      }
    }

    fetchChantiers();
  }, [login]);

  useEffect(() => {
    async function fetchEtapes() {
      if (!login || !nochantier) {
        setEtapes([]);
        setNoetape("");
        return;
      }

      try {
        const res = await fetch(
          `/api/etapes_artisan_facturable?login=${encodeURIComponent(login)}&chantier=${nochantier}`
        );
        const data = await res.json();
        if (!res.ok) {
          showError("Erreur serveur");
          setEtapes([]);
          setNoetape("");
          return;
        }
        const liste = Array.isArray(data) ? data : [];
        setEtapes(liste);
        setNoetape("");
      } catch (_error) {
        showError("Erreur serveur");
        setEtapes([]);
        setNoetape("");
      }
    }

    fetchEtapes();
  }, [login, nochantier]);

  const etapeSelectionnee = useMemo(
    () => etapes.find((etape) => String(etape.noetape) === String(noetape)),
    [etapes, noetape]
  );

  useEffect(() => {
    if (!etapeSelectionnee) {
      setMontantfacture("");
      setNbjourstravail("");
      return;
    }

    const montantTheo = Number(etapeSelectionnee.montanttheoriquefacture || 0);
    setMontantfacture(montantTheo.toFixed(2));

    if (etapeSelectionnee.datedebut && etapeSelectionnee.datefin) {
      const debut = new Date(etapeSelectionnee.datedebut);
      const fin = new Date(etapeSelectionnee.datefin);
      const diffDays = Math.max(
        0,
        Math.round((fin - debut) / (1000 * 60 * 60 * 24))
      );
      setNbjourstravail(String(diffDays));
    } else {
      setNbjourstravail("");
    }
  }, [etapeSelectionnee]);

  async function onSubmit(e) {
    e.preventDefault();

    if (!login || !nochantier || !noetape || !datefacture) {
      showError("Erreur serveur");
      return;
    }

    const payload = {
      login,
      nochantier: Number(nochantier),
      noetape: Number(noetape),
      datefacture,
      montantfacture: Number(montantfacture),
      nbjourstravail: Number(nbjourstravail),
    };

    try {
      const res = await fetch("/api/creer_facture_artisan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        showError("Erreur serveur");
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Facture créée",
        text: `La facture n°${data.nofacture} a bien été enregistrée.`,
        confirmButtonText: "OK",
      });
      setNoetape("");
      setEtapes((prev) =>
        prev.filter((etape) => String(etape.noetape) !== String(payload.noetape))
      );
    } catch (_error) {
      showError("Erreur serveur");
    }
  }

  return (
    <div className="artisan">
      <div className="appelForm">
        <div className="BulleArtisan">
          <h1>Générer une facture</h1>

          <form onSubmit={onSubmit} className="form-grid">
            <label className="full-width">
              Chantier
              <SearchableSelect
                options={chantiers}
                value={nochantier}
                onChange={(value) => setNochantier(String(value))}
                getOptionValue={(chantier) => chantier.nochantier}
                getOptionLabel={(chantier) =>
                  `${chantier.nochantier} - ${chantier.adressechantier}`
                }
                placeholder="Sélectionnez un chantier..."
              />
            </label>

            <label className="full-width">
              Étape
              <SearchableSelect
                options={etapes}
                value={noetape}
                onChange={(value) => setNoetape(String(value))}
                getOptionValue={(etape) => etape.noetape}
                getOptionLabel={(etape) =>
                  `${etape.noetape} - ${(etape.nometape || "").trim()}`
                }
                placeholder="Sélectionnez une étape..."
              />
            </label>

            <label>
              Date facture
              <input
                type="date"
                value={datefacture}
                onChange={(e) => setDatefacture(e.target.value)}
                required
              />
            </label>

            <label>
              Montant facture (€)
              <input
                type="number"
                min="0"
                step="0.01"
                value={montantfacture}
                onChange={(e) => setMontantfacture(e.target.value)}
                required
              />
            </label>

            <label className="full-width">
              Nombre de jours travaillés
              <input
                type="number"
                min="0"
                step="1"
                value={nbjourstravail}
                onChange={(e) => setNbjourstravail(e.target.value)}
                required
              />
            </label>

            <button className="Valid" type="submit">
              Créer la facture
            </button>
          </form>

          {chantiers.length === 0 && (
            <p className="no-data">Aucun chantier trouvé pour cet artisan.</p>
          )}
          {nochantier && etapes.length === 0 && (
            <p className="no-data">Aucune étape facturable sur ce chantier.</p>
          )}
        </div>
      </div>
    </div>
  );
}
