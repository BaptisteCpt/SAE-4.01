"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import SearchableSelect from "./SearchableSelect";
import "../css/artisan.css";
import Swal from "sweetalert2";

/**
 * Formulaire de génération de facture artisan.
 * @returns {JSX.Element}
 */
export default function GenererFactureArtisan({ login }) {
  const searchParams = useSearchParams();
  const urlChantierApplied = useRef(false);
  const urlEtapeApplied = useRef(false);
  const [chantiers, setChantiers] = useState([]);
  const [etapes, setEtapes] = useState([]);
  const [nochantier, setNochantier] = useState("");
  const [noetape, setNoetape] = useState("");
  const [datefacture, setDatefacture] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [montantfacture, setMontantfacture] = useState("");
  const [nbjourstravail, setNbjourstravail] = useState("");
  const [phase, setPhase] = useState("saisie");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);

  function showError(message) {
    Swal.fire({
      icon: "error",
      title: "Erreur",
      text: message,
      confirmButtonText: "OK",
    });
  }

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
    if (urlChantierApplied.current || chantiers.length === 0) return;
    const c = searchParams.get("chantier");
    if (!c) return;
    const nc = Number(c);
    if (!Number.isFinite(nc) || !chantiers.some((ch) => ch.nochantier === nc)) return;
    setNochantier(String(nc));
    urlChantierApplied.current = true;
  }, [chantiers, searchParams]);

  useEffect(() => {
    if (urlEtapeApplied.current || !urlChantierApplied.current) return;
    const e = searchParams.get("etape");
    if (!e || !nochantier || etapes.length === 0) return;
    const ne = Number(e);
    if (!Number.isFinite(ne) || !etapes.some((et) => Number(et.noetape) === ne)) return;
    setNoetape(String(ne));
    urlEtapeApplied.current = true;
  }, [etapes, nochantier, searchParams]);

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

  const chantierCourant = useMemo(
    () => chantiers.find((c) => String(c.nochantier) === String(nochantier)),
    [chantiers, nochantier]
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

  function allerVersApercu(e) {
    e.preventDefault();
    const f = formRef.current;
    if (f && !f.checkValidity()) {
      f.reportValidity();
      return;
    }

    if (!login || !nochantier || !noetape || !datefacture) {
      showError("Veuillez remplir chantier, étape et date de facture.");
      return;
    }

    const m = Number(montantfacture);
    const j = Number(nbjourstravail);
    if (!Number.isFinite(m) || m < 0) {
      showError("Le montant doit être un nombre positif ou nul.");
      return;
    }
    if (!Number.isFinite(j) || j < 0 || !Number.isInteger(j)) {
      showError("Le nombre de jours doit être un entier positif ou nul.");
      return;
    }

    setPhase("apercu");
  }

  async function enregistrerFacture() {
    if (!login || !nochantier || !noetape || !datefacture) {
      showError("Données incomplètes.");
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

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/creer_facture_artisan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        showError(
          typeof data?.error === "string" ? data.error : "Erreur lors de l'enregistrement."
        );
        return;
      }

      Swal.fire({
        icon: "success",
        title: "Facture créée",
        text: `La facture n°${data.nofacture} a bien été enregistrée.`,
        confirmButtonText: "OK",
      });
      setPhase("saisie");
      setNoetape("");
      setEtapes((prev) =>
        prev.filter((etape) => String(etape.noetape) !== String(payload.noetape))
      );
    } catch (_error) {
      showError("Erreur réseau.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="artisan">
      <div className="appelForm">
        <div className="BulleArtisan">
          <h1>Générer une facture</h1>

          {phase === "saisie" ? (
            <form ref={formRef} onSubmit={allerVersApercu} className="form-grid">
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
                Prévisualiser
              </button>
            </form>
          ) : (
            <div className="facture-preview-artisan">
              <h2>Récapitulatif — vérifiez avant validation</h2>
              <div className="preview-row">
                <span className="preview-label">Chantier</span>
                <span className="preview-value">
                  {chantierCourant
                    ? `n°${chantierCourant.nochantier} — ${chantierCourant.adressechantier}, ${chantierCourant.cpchantier} ${chantierCourant.villechantier}`
                    : "—"}
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Étape</span>
                <span className="preview-value">
                  {etapeSelectionnee
                    ? `n°${etapeSelectionnee.noetape} — ${(etapeSelectionnee.nometape || "").trim()}`
                    : "—"}
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Date de facture</span>
                <span className="preview-value">
                  {datefacture
                    ? new Date(datefacture + "T12:00:00").toLocaleDateString("fr-FR")
                    : "—"}
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Montant TTC</span>
                <span className="preview-value">
                  {Number(montantfacture).toFixed(2)} €
                </span>
              </div>
              <div className="preview-row">
                <span className="preview-label">Jours travaillés</span>
                <span className="preview-value">{nbjourstravail}</span>
              </div>
              <div className="preview-actions">
                <button
                  type="button"
                  className="Secondary"
                  disabled={isSubmitting}
                  onClick={() => setPhase("saisie")}
                >
                  Modifier
                </button>
                <button
                  type="button"
                  className="Valid"
                  disabled={isSubmitting}
                  onClick={enregistrerFacture}
                >
                  {isSubmitting ? "Enregistrement…" : "Valider et enregistrer"}
                </button>
              </div>
            </div>
          )}

          {chantiers.length === 0 && (
            <p className="no-data">Aucun chantier trouvé pour cet artisan.</p>
          )}
          {nochantier && etapes.length === 0 && phase === "saisie" && (
            <p className="no-data">Aucune étape facturable sur ce chantier.</p>
          )}
        </div>
      </div>
    </div>
  );
}
