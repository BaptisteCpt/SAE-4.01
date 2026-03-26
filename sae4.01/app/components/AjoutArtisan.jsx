"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import SearchableSelect from "./SearchableSelect";

export default function AjoutArtisan() {
  const searchParams = useSearchParams();
  const [idSelectionne, setIdSelectionne] = useState(searchParams.get("id") || "");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [mail, setMail] = useState("");
  const [adresse, setAdresse] = useState("");
  const [mdp, setMdp] = useState("");
  const [cp, setCp] = useState("");
  const [ville, setVille] = useState("");

  const [listeArti, setListeArti] = useState([]);
  const [toutesLesEtapes, setToutesLesEtapes] = useState([]);
  const [etapesSelectionnees, setEtapesSelectionnees] = useState([]);
  const router = useRouter();

  async function getArti() {
    try {
      const res = await fetch("/api/recup_arti_bis");
      if (res.ok) {
        const data = await res.json();
        setListeArti(data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    getArti();
    async function fetchEtapes() {
      try {
        const res = await fetch("/api/recup_etapes");
        const data = await res.json();
        const etapesUniques = Array.from(new Map(data.map((item) => [item.noetape, item])).values());
        setToutesLesEtapes(etapesUniques);
      } catch (err) {}
    }
    fetchEtapes();
  }, []);

  function Selectionner(e) {
    const id = e.target.value;
    setIdSelectionne(id);

    if (id === "") {
      setNom("");
      setPrenom("");
      setMail("");
      setAdresse("");
      setCp("");
      setVille("");
      setMdp("");
      setEtapesSelectionnees([]);
    } else {
      const artisan = listeArti.find((a) => a.noartisan === parseInt(id));
      if (artisan) {
        setNom(artisan.nomartisan || "");
        setPrenom(artisan.prenomartisan || "");
        setMail(artisan.mail || "");
        setAdresse(artisan.adresseartisan || "");
        setCp(artisan.cpartisan || "");
        setVille(artisan.villeartisan || "");
        // On vide toujours le mot de passe quand on sélectionne un utilisateur existant (sécurité)
        setMdp(""); 
        if (artisan.etre_qualifie_pour) {
          const idsEtapes = artisan.etre_qualifie_pour.map((relation) => relation.noetape);
          setEtapesSelectionnees(idsEtapes);
        } else {
          setEtapesSelectionnees([]);
        }
      }
    }
  }

  function caseCocher(idEtape) {
    if (etapesSelectionnees.includes(idEtape)) {
      setEtapesSelectionnees((prev) => prev.filter((id) => id !== idEtape));
    } else {
      setEtapesSelectionnees((prev) => [...prev, idEtape]);
    }
  }

  async function validerForm(e) {
    e.preventDefault();

    if (!prenom || !nom || !cp) {
      Swal.fire({
        title: "Champs manquants",
        text: "Veuillez compléter au moins Nom, Prénom et Code Postal",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    // Si on est en création et que le mdp est vide, on peut soit bloquer, soit laisser l'API le générer.
    // L'API génère déjà "login" par défaut, donc on ne bloque pas ici.

    const dataToSend = {
      nom,
      prenom,
      mail,
      mdp, // On envoie le mot de passe tapé
      adresse,
      cp,
      ville,
      etapes: etapesSelectionnees.map((id) => Number(id)),
    };

    try {
      let url = "/api/cre_artisant";
      let method = "POST";
      let successMessage = "L'artisan a été créé avec succès.";

      if (idSelectionne) {
        url = "/api/maj_artisan";
        method = "PUT";
        dataToSend.id = idSelectionne;
        successMessage = "L'artisan a été modifié avec succès.";
      }

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      });

      if (res.ok) {
        await Swal.fire({ title: "Succès !", text: successMessage, icon: "success", confirmButtonText: "Parfait" });
        router.push("/pageListeUtilisateurs");
      } else {
        const info = await res.json();
        Swal.fire({ title: "Erreur", text: info.error || "Une erreur est survenue", icon: "error" });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ title: "Erreur Serveur", text: "Impossible de contacter le serveur", icon: "error" });
    }
  }

  return (
    <div className="bulle">
      <h1>Gestion des Artisans</h1>
      <form>
        <label>Sélectionner un artisan (ou Nouveau) :</label>
        <SearchableSelect
          options={listeArti}
          value={idSelectionne}
          onChange={(value) => Selectionner({ target: { value } })}
          getOptionValue={(arti) => arti.noartisan}
          getOptionLabel={(arti) => `${arti.nomartisan.trim()} ${arti.prenomartisan.trim()}`}
          placeholder="-- Créer un Nouvel Artisan --"
        />
        <h2>{idSelectionne ? "Modifier l'Artisan" : "Nouvel Artisan"}</h2>

        <label>Nom :</label>
        <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />

        <label>Prénom :</label>
        <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom..." />

        <label>
            Mot de Passe : 
            {idSelectionne && <span style={{fontSize: '11px', color: 'gray', fontWeight: 'normal', marginLeft: '10px'}}>(Laissez vide pour ne pas modifier)</span>}
        </label>
        <input type="text" value={mdp} onChange={(e) => setMdp(e.target.value)} placeholder="Mot de Passe..." />

        <label>Mail :</label>
        <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} placeholder="Mail..." />

        <label>Adresse :</label>
        <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse..." />

        <label>Code Postal :</label>
        <input type="text" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Code Postal..." />

        <label>Ville :</label>
        <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ville..." />

        <label>Qualifications :</label>
        <div className="etapes-container">
          {toutesLesEtapes.map((etape) => (
            <div key={etape.noetape} className="etape-item" onClick={() => caseCocher(etape.noetape)} style={{ cursor: "pointer" }}>
              <input type="checkbox" checked={etapesSelectionnees.includes(etape.noetape)} readOnly style={{ pointerEvents: "none" }} />
              <span style={{ marginLeft: "10px" }}>{etape.nometape}</span>
            </div>
          ))}
        </div>

        <div className="form-buttons">
          <button className="but" type="button" onClick={validerForm}>
            {idSelectionne ? "Enregistrer" : "Valider"}
          </button>
          <button className="but" type="button" onClick={() => router.back()}>Annuler</button>
        </div>
      </form>
    </div>
  );
}