'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../css/pclient.css' 

/**
 * Composant pour afficher la liste des clients
 * Permet de sélectionner un client et de créer un chantier pour ce client
 * @returns {JSX.Element} La page de liste des clients
 */
export default function PageClients() { 
    const [clients, setClients] = useState([]); 
    const [idclient, setIdclient] = useState(null);
    
    const router = useRouter();

    /**
     * Charge la liste de tous les clients au chargement du composant
     */
    useEffect(() => {
        /**
         * Récupère la liste de tous les clients depuis l'API
         */
        async function fetchClients() {
            try {
                const res = await fetch('/api/recup_client', { method: 'GET' });
                if (res.ok) {
                    const data = await res.json();
                    // Vérifie que la réponse est bien un tableau avant de l'utiliser
                    if (Array.isArray(data)) {
                        setClients(data);
                    }
                } else {
                    console.error("Erreur lors de la récupération");
                }
            } catch (err) {
                console.error("Erreur serveur :", err);
            }
        }
        fetchClients();
    }, []);

    /**
     * Gère le clic sur une ligne du tableau pour sélectionner/désélectionner un client
     * Si le client est déjà sélectionné, on le désélectionne (toggle)
     * @param {number} id - L'ID du client cliqué
     */
    const handleRowClick = (id) => {
        // Si le client est déjà sélectionné, on le désélectionne
        if (idclient === id) {
            setIdclient(null);
        } else {
            // Sinon, on sélectionne le nouveau client
            setIdclient(id);
        }
    };

    /**
     * Redirige vers la page de création de chantier avec l'ID du client sélectionné
     * Passe l'ID du client en paramètre d'URL pour l'utiliser dans le formulaire suivant
     */
    const GoCreaChantier = () => {
        if (idclient) {
            // Passe l'ID du client en paramètre d'URL
            router.push(`/creation_de_chantier/crea_chantier?client_id=${idclient}`);
        }
    };

    return (
        <div className='liste_clients'>
            <div className="bulle_liste_clients">
                <h1>Liste des Clients</h1>
                
                <table className="table_clients">
                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Prénom</th>
                            <th>Adresse</th>
                            <th>Ville</th>
                            <th>Code Postal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <tr key={client.noclient || index} onClick={() => handleRowClick(client.noclient)}
                                className={idclient === client.noclient ? "row-selected" : ""}>
                                <td data-label="Nom">{client.nomclient.trim().toUpperCase()}</td>
                                <td data-label="Prénom">{client.prenomclient.trim().toUpperCase()}</td>
                                <td data-label="Adresse">{client.adresseclient.trim().toUpperCase()}</td>
                                <td data-label="Ville">{client.villeclient.trim().toUpperCase()}</td>
                                <td data-label="Code Postal">{client.cpclient.trim().toUpperCase()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {idclient && (
                    <div className="bar_selection">
                        <button className="btn_creation" onClick={GoCreaChantier}>
                            Créer un chantier pour ce client
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}