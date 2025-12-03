'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useChantier } from '../../context/ChantierContext'

export default function ClientForm() {
    // Initialisation des constantes et leurs setter
    const { data, setData } = useChantier();

    const [nom, setNom] = useState(data.nom || "");
    const [prenom, setPrenom] = useState(data.prenom || "");
    const [adresse, setAdresse] = useState(data.adresse || "");
    const [ville, setVille] = useState(data.ville || "");
    const [code_postal, setCodePostal] = useState(data.code_postal || "");
    
    const [idClient, setIdClient] = useState(""); 
    const [clients, setClients] = useState([]);

    const router = useRouter()
    const [error, setError] = useState()
    const [success, setSuccess] = useState(false)

    // Au chargement de la page, on récupère tout les clients existants que l'on enregistre dans le tableau clients
    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch('/api/recup_client');
                const info = await res.json();

                if (Array.isArray(info)) {
                    setClients(info);
                } else {
                    setClients([]);
                }
            } catch (err) {
                console.error('Erreur Fetch', err);
            }
        }
        fetchClients();
    }, []);

    // Récupération des infos à la selection d'un client
    const clientSelectionner = (e) => {
        const idSelectionner = parseInt(e.target.value);
        setIdClient(idSelectionner);
        const clientTrouve = clients.find(c => c.noclient === idSelectionner);
        
        if (clientTrouve) {
            setNom(clientTrouve.nomclient || "");
            setPrenom(clientTrouve.prenomclient || "");
            setAdresse(clientTrouve.adresseclient || "");
            setVille(clientTrouve.villeclient || "");
            setCodePostal(clientTrouve.cpclient || "");
        }
    };

    // Vérification que tout les champs obligatoire sont bien rempli et enregistrement dans la base de données puis stockage de ces champs dans le tableau data
    async function next_page() {
        if (nom.length == 0 || prenom.length == 0 || adresse.length == 0 || ville.length == 0 || code_postal.length == 0) {
            setError("Veuillez compléter les champs manquants");
            return;
        }
        try {
            const res = await fetch('/api/cre_client', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nom, prenom, adresse, ville, code_postal }),
            });

            const info = await res.json();

            if (!res.ok) {
                setError(info.error || 'Erreur de connexion');
                return;
            }

            if (res.ok) {
                setData({ ...data, noclient: info.noclient, nom, prenom, adresse, ville, code_postal });
                setSuccess(true);
            }
        } catch (err) {
            setError('Erreur Server');
        }
    }

    // au chargement de la page, si le succès est à true on redirige sur la prochaine page
    useEffect(() => {
        if (success) {
            router.push("/creation_de_chantier/crea_chantier");
        }
    }, [success, router]);

    return (
        <div className='BulleDuFormulaire'>
            <h1>Création d'un Chantier</h1>
            <p>
                Profil du Client
            </p>

            <label>Sélectionner un client existant (ou remplir manuellement) :</label>
            <br/>
            
            <select name="liste_client" className="liste_client" value={idClient} onChange={clientSelectionner}>
                <option value="" hidden>Choisir un Client</option>
                {clients.map((client) => (
                    <option key={client.noclient} value={client.noclient}>
                        {client.nomclient} {client.prenomclient}
                    </option>
                ))}
            </select>

            <form>
                <label>
                    Nom:
                    <input type="text" name="Nom" placeholder="Nom..." value={nom} onChange={(e) => setNom(e.target.value)} />
                </label>
                <br />
                <label>
                    Prénom:
                    <input type="text" name="Prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                </label>
                <br />
                <label>
                    Adresse:
                    <input type="text" name="Adresse" placeholder="Adresse..." value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                </label>
                <br />
                <label>
                    Ville:
                    <input type="text" name="Ville" placeholder="Ville..." value={ville} onChange={(e) => setVille(e.target.value)} />
                </label>
                <br />
                <label>
                    Code Postal:
                    <input type="text" name="CodePostal" placeholder="Code Postal..." value={code_postal} onChange={(e) => setCodePostal(e.target.value)} />
                </label>
                <br />
                <button type="button" onClick={next_page}>Continuer</button>
            </form>
            
            {error && <p>{error}</p>}
        </div>
    )
}