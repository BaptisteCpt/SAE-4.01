"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useChantier } from "../../context/ChantierContext";
import SearchableSelect from "./SearchableSelect";

/**
 * Composant pour créer ou sélectionner un client
 * Utilise le contexte ChantierContext pour stocker les données du client
 * @returns {JSX.Element} Le formulaire de gestion du client
 */
export default function ClientForm() {
  // Récupère les données et la fonction de mise à jour du contexte
  const { data, setData } = useChantier();

  const [nom, setNom] = useState(data.nom || "");
  const [prenom, setPrenom] = useState(data.prenom || "");
  const [adresse, setAdresse] = useState(data.adresse || "");
  const [ville, setVille] = useState(data.ville || "");
  const [code_postal, setCodePostal] = useState(data.code_postal || "");

  const [idClient, setIdClient] = useState("");
  const [clients, setClients] = useState([]);

  const router = useRouter();
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  /**
   * Charge la liste de tous les clients existants au chargement du composant
   * Permet de sélectionner un client existant plutôt que d'en créer un nouveau
   */
  useEffect(() => {
    /**
     * Récupère la liste de tous les clients depuis l'API
     */
    async function fetchClients() {
      try {
        const res = await fetch("/api/recup_client");
        const info = await res.json();

        // Vérifie que la réponse est bien un tableau avant de l'utiliser
        if (Array.isArray(info)) {
          setClients(info);
        } else {
          setClients([]); // Initialise avec un tableau vide si la réponse n'est pas valide
        }
      } catch (err) {
        console.error("Erreur Fetch", err);
      }
    }
    fetchClients();
  }, []);

  /**
   * Gère la sélection d'un client existant dans la liste déroulante
   * Remplit automatiquement le formulaire avec les informations du client sélectionné
   * @param {Event} e - L'événement de changement de sélection
   */
  const clientSelectionner = (e) => {
    // Convertit la valeur sélectionnée (string) en nombre
    const idSelectionner = parseInt(e.target.value);
    setIdClient(idSelectionner);
    // Recherche le client correspondant dans la liste
    const clientTrouve = clients.find((c) => c.noclient === idSelectionner);

    // Remplit le formulaire avec les données du client trouvé
    if (clientTrouve) {
      // Utilise || "" pour éviter les valeurs null/undefined
      setNom(clientTrouve.nomclient || "");
      setPrenom(clientTrouve.prenomclient || "");
      setAdresse(clientTrouve.adresseclient || "");
      setVille(clientTrouve.villeclient || "");
      setCodePostal(clientTrouve.cpclient || "");
    }
  };

  /**
   * Valide le formulaire, crée ou récupère le client, puis passe à l'étape suivante
   * Stocke les données du client dans le contexte pour les utiliser dans le formulaire de chantier
   */
  async function next_page() {
    // Vérifie que tous les champs obligatoires sont remplis
    if (
      nom.length == 0 ||
      prenom.length == 0 ||
      adresse.length == 0 ||
      ville.length == 0 ||
      code_postal.length == 0
    ) {
      setError("Veuillez compléter les champs manquants");
      return;
    }
    try {
      const res = await fetch("/api/cre_client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nom, prenom, adresse, ville, code_postal }),
      });

      const info = await res.json();

      if (!res.ok) {
        setError(info.error || "Erreur de connexion");
        return;
      }

      if (res.ok) {
        // Stocke les données du client dans le contexte pour les utiliser dans le formulaire suivant
        // L'API retourne le client existant ou le nouveau client créé avec son ID
        setData({
          ...data,
          noclient: info.noclient,
          nom,
          prenom,
          adresse,
          ville,
          code_postal,
        });
        setSuccess(true); // Déclenche la redirection via useEffect
      }
    } catch (err) {
      setError("Erreur serveur");
    }
  }

  /**
   * Redirige vers le formulaire de création de chantier après la création/récupération réussie du client
   */
  useEffect(() => {
    if (success) {
      router.push("/creation_de_chantier/crea_chantier");
    }
  }, [success, router]);

  return (
    <div className="BulleDuFormulaire">
      <h1>Création d'un Chantier</h1>
      <p>Profil du Client</p>

      <label>Sélectionner un client existant (ou remplir manuellement) :</label>
      <br />

      <SearchableSelect
        options={clients}
        value={idClient}
        onChange={(value) => clientSelectionner({ target: { value } })}
        getOptionValue={(client) => client.noclient}
        getOptionLabel={(client) =>
          `${client.nomclient.trim().toUpperCase()} ${client.prenomclient.trim()}`
        }
        placeholder="Choisir un Client"
      />

      <form>
        <label>
          Nom:
          <input
            type="text"
            name="Nom"
            placeholder="Nom..."
            value={nom}
            onChange={(e) => setNom(e.target.value)}
          />
        </label>
        <br />
        <label>
          Prénom:
          <input
            type="text"
            name="Prenom"
            placeholder="Prénom..."
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
          />
        </label>
        <br />
        <label>
          Adresse:
          <input
            type="text"
            name="Adresse"
            placeholder="Adresse..."
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </label>
        <br />
        <label>
          Ville:
          <input
            type="text"
            name="Ville"
            placeholder="Ville..."
            value={ville}
            onChange={(e) => setVille(e.target.value)}
          />
        </label>
        <br />
        <label>
          Code Postal:
          <input
            type="text"
            name="CodePostal"
            placeholder="Code Postal..."
            value={code_postal}
            onChange={(e) => setCodePostal(e.target.value)}
          />
        </label>
        <br />
        <button type="button" onClick={next_page}>
          Continuer
        </button>
      </form>

      {error && <p>{error}</p>}
    </div>
  );
}
