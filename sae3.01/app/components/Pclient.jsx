'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../css/accueil.css' 

export default function PageClients() { 
    const [clients, setClients] = useState([]); 
    const [idclient, setIdclient] = useState(null);
    
    const router = useRouter();

    useEffect(() => {
        async function fetchClients() {
            try {
                const res = await fetch('/api/recup_client', { method: 'GET' });
                if (res.ok) {
                    const data = await res.json();
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

    const handleRowClick = (id) => {
        if (idclient === id) {
            setIdclient(null);
        } else {
            setIdclient(id);
        }
    };


    const GoCreaChantier = () => {
        if (idclient) {
            router.push(`/creation_de_chantier/crea_chantier?client_id=${idclient}`);
        }
    };

    return (
        <div className="liste_clients">
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
                            <td>{client.nomclient}</td>
                            <td>{client.prenomclient}</td>
                            <td>{client.adresseclient}</td>
                            <td>{client.villeclient}</td>
                            <td>{client.cpclient}</td>
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
    )
}