"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import SearchableSelect from '../components/SearchableSelect';

/**
 * Composant pour modifier les informations d'un chantier
 * Charge les données du chantier et permet de modifier toutes ses informations
 * @returns {JSX.Element} Le formulaire de modification de chantier
 */
export default function PageModifChantier() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idChantier = searchParams.get("id");
  const [adresse, setAdresse] = useState("");
  const [ville, setVille] = useState("");
  const [cp, setCp] = useState("");
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedModele, setSelectedModele] = useState("");
  const [selectedMoe, setSelectedMoe] = useState("");
  const [clients, setClients] = useState([]);
  const [modeles, setModeles] = useState([]);
  const [moes, setMoes] = useState([]);

  useEffect(() => {
    if (!idChantier) {
      router.push("/pageListeChantier");
      return;
    }
    /**
     * Charge toutes les données nécessaires pour le formulaire de modification
     * Effectue 4 appels API en parallèle pour optimiser les performances :
     * - Liste des clients
     * - Liste des modèles
     * - Liste des maîtres d'œuvre
     * - Données du chantier à modifier
     */
    async function chargerDonnees() {
      try {
        // Utilisation de Promise.all pour charger toutes les données en parallèle
        // Cela améliore les performances en évitant d'attendre chaque requête séquentiellement
        const [resCli, resMod, resMoe, resChantier] = await Promise.all([
          fetch("/api/recup_client"),
          fetch("/api/modele_maison"),
          fetch("/api/recup_moe"),
          fetch("/api/recup_un_chantier", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: idChantier }),
          }),
        ]);
        // Mise à jour des listes si les requêtes sont réussies
        if (resCli.ok) setClients(await resCli.json());
        if (resMod.ok) setModeles(await resMod.json());
        if (resMoe.ok) setMoes(await resMoe.json());
        // Remplissage du formulaire avec les données du chantier
        if (resChantier.ok) {
          const data = await resChantier.json();
          // Utilisation de || "" pour éviter les valeurs null/undefined
          setAdresse(data.adressechantier || "");
          setVille(data.villechantier || "");
          setCp(data.cpchantier || "");
          setSelectedClient(data.noclient || "");
          setSelectedModele(data.nomodele || "");
          setSelectedMoe(data.nomoe || "");
        } else {
          Swal.fire("Erreur", "Chantier introuvable", "error");
          router.push("/pageListeChantier");
        }
      } catch (err) {
        console.error(err);
        Swal.fire("Erreur", "Problème de connexion serveur", "error");
      }
    }
    chargerDonnees();
  }, [idChantier, router]);
  /**
   * Valide et soumet les modifications du chantier
   * Vérifie que les champs obligatoires sont remplis, puis appelle l'API pour mettre à jour
   * @param {Event} e - L'événement de soumission du formulaire
   */
  async function validerModif(e) {
    e.preventDefault();
    // Vérification des champs obligatoires (adresse, ville, CP, client)
    if (!adresse || !ville || !cp || !selectedClient) {
      Swal.fire({
        title: "Champs manquants",
        text: "Veuillez remplir au moins l'adresse et le client",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
    try {
      // Envoi des données modifiées à l'API
      const res = await fetch("/api/maj_chantier", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: idChantier,
          adresse: adresse,
          cp: cp,
          ville: ville,
          client: selectedClient,
          modele: selectedModele,
          moe: selectedMoe,
        }),
      });

      if (res.ok) {
        await Swal.fire({
          title: "Succès !",
          text: "Le chantier a été modifié avec succès.",
          icon: "success",
          confirmButtonText: "Retour à la liste",
        });
        router.push("/pageAdminChantier");
      } else {
        // Récupération du message d'erreur de l'API
        const info = await res.json();
        Swal.fire(
          "Erreur",
          info.error || "Erreur lors de la modification",
          "error",
        );
      }
    } catch (err) {
      Swal.fire("Erreur", "Erreur serveur", "error");
    }
  }

  return (
    <>
      <div className="bulle">
        <h1>Modifier le Chantier N°{idChantier}</h1>

        <form>
          <label>Client :</label>
          <SearchableSelect
            options={clients}
            value={selectedClient}
            onChange={(value) => setSelectedClient(value)}
            getOptionValue={(client) => client.noclient}
            getOptionLabel={(client) =>
              `${client.nomclient.trim()} ${client.prenomclient.trim()}`
            }
            placeholder="-- Sélectionner un client --"
          />

          <label>Adresse :</label>
          <input
            type="text"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
          <label>Code Postal :</label>
          <input
            type="text"
            value={cp}
            onChange={(e) => setCp(e.target.value)}
          />
          <label>Ville :</label>
          <input
            type="text"
            value={ville}
            onChange={(e) => setVille(e.target.value)}
          />

          <label>Modèle de Maison :</label>
          <SearchableSelect
            options={modeles}
            value={selectedModele}
            onChange={(value) => setSelectedModele(value)}
            getOptionValue={(modele) => modele.nomodele}
            getOptionLabel={(modele) => `${modele.nommodele.trim()}`}
            placeholder="-- Sélectionner un modèle --"
          />

          <label>Maître d'Oeuvre :</label>
          <SearchableSelect
            options={moes}
            value={selectedMoe}
            onChange={(value) => setSelectedMoe(value)}
            getOptionValue={(moe) => moe.nomoe}
            getOptionLabel={(moe) =>
              `${moe.nommoe.trim()} ${moe.prenommoe.trim()}`
            }
            placeholder="-- Sélectionner un MOE --"
          />

          <div className="form-buttons">
            <button type="button" className="but" onClick={validerModif}>
              Enregistrer
            </button>
            <button type="button" className="but" onClick={() => router.back()}>
              Annuler
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
