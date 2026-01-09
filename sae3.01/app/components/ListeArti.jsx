'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

/**
 * Composant pour afficher la liste de tous les artisans
 * Permet de modifier ou supprimer des artisans
 * @returns {JSX.Element} La liste des artisans avec actions
 */
export default function PageListeArti() {

    const router = useRouter();
    const [liste, setListe] = useState([])

    useEffect(() => {
        /**
         * Récupère la liste de tous les artisans depuis l'API
         */
        async function recupListe() {
            try {
                const res = await fetch('/api/recup_arti_bis')
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        recupListe()
    }, [])

    /**
     * Supprime un artisan après confirmation
     * @param {number} id - L'ID de l'artisan à supprimer
     * @param {string} nom - Le nom de l'artisan à supprimer
     */
    async function Suppr(id, nom) {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer l'artisan "${nom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/supprartisant', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(artisan => artisan.noartisan !== id));
                    Swal.fire(
                        'Supprimé !',
                        'Suppression réussie !',
                        'success'
                    );
                } else {
                    const info = await res.json();
                    Swal.fire(
                        'Erreur',
                        info.error || "Impossible de supprimer",
                        'error'
                    );
                }
            } catch (err) {
                console.error(err);
                Swal.fire(
                    'Erreur',
                    "Erreur de connexion serveur",
                    'error'
                );
            }
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Liste des Artisans</h1>
                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Ville</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((arti) => (
                                <tr key={arti.noartisan}>
                                    <td data-label="Nom">{arti.nomartisan}</td>
                                    <td data-label="Prénom">{arti.prenomartisan}</td>
                                    <td data-label="Ville">{arti.villeartisan}</td>
                                    <td data-label="Action">
                                        <button className='but' onClick={() => router.push(`/pageModifArti?id=${arti.noartisan}`)}>Modifier</button>
                                        <button className='but' onClick={() => Suppr(arti.noartisan, arti.nomartisan)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {liste.length === 0 && <p>Aucun artisan trouvé.</p>}
            </div>
        </>
    )
}