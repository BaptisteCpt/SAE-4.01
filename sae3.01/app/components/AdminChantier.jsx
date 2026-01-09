'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

/**
 * Composant pour afficher la liste de tous les chantiers
 * Permet de modifier ou supprimer des chantiers
 * @returns {JSX.Element} La liste des chantiers avec actions
 */
export default function PageListeChantier() {

    const [liste, setListe] = useState([]);
    const router = useRouter();

    useEffect(() => {
        /**
         * Récupère la liste de tous les chantiers depuis l'API
         */
        async function recupChantier() {
            try {
                const res = await fetch('/api/recup_chantier');
                const data = await res.json();
                if (res.ok) setListe(data);
            } catch (err) { console.error(err); }
        }
        recupChantier();
    }, []);

    /**
     * Supprime un chantier après confirmation
     * @param {number} id - L'ID du chantier à supprimer
     */
    async function Suppr(id) {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: "Vous ne pourrez pas revenir en arrière !",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0a60b0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/supprchantier', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prev => prev.filter(c => c.nochantier !== id));
                    Swal.fire('Supprimé !', 'Le chantier a été supprimé.', 'success');
                } else {
                    const info = await res.json();
                    Swal.fire('Erreur', info.error || "Problème serveur", 'error');
                }
            } catch (err) { 
                Swal.fire('Erreur', "Impossible de contacter le serveur", 'error');
            }
        }
    }

    /**
     * Redirige vers la page de modification d'un chantier
     * @param {number} id - L'ID du chantier à modifier
     */
    function modif(id) {
        router.push(`/pageModifChantier?id=${id}`);
    }

    /**
     * Formate une date au format français
     * @param {string} dateString - La date à formater
     * @returns {string} La date formatée ou "-" si la date est vide
     */
    function formatDate(dateString) {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString('fr-FR');
    }

    return (
        <>
            <div className="bulle">
                <h1>Liste des Chantiers</h1>
                
                <div className="table-container"> 
                    <table>
                        <thead>
                            <tr>
                                <th>N°</th>
                                <th>Client</th>
                                <th>Adresse</th>
                                <th>Ville</th>
                                <th>Modèle</th>
                                <th>Maître d'œuvre</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((chantier) => (
                                <tr key={chantier.nochantier}>
                                    <td data-label="N°">{chantier.nochantier}</td>
                                    <td data-label="Client">{chantier.client ? chantier.client.nomclient : 'Inconnu'}</td>
                                    <td data-label="Adresse">{chantier.adressechantier}</td>
                                    <td data-label="Ville">{chantier.villechantier} ({chantier.cpchantier})</td>
                                    <td data-label="Modèle">{chantier.modele ? chantier.modele.nommodele : '-'}</td>
                                    <td data-label="Maître d'œuvre">{chantier.maitre_oeuvre ? chantier.maitre_oeuvre.nommoe : '-'}</td>
                                    <td data-label="Date">{formatDate(chantier.datecreation)}</td>
                                    <td data-label="Actions">
                                        <button className='but' onClick={() => modif(chantier.nochantier)}>Modifier</button>
                                        <button className='but'onClick={() => Suppr(chantier.nochantier)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {liste.length === 0 && <p className="Pdonner">Aucun chantier enregistré.</p>}
            </div>
        </>
    )
}
