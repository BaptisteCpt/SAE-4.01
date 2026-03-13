'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

/**
 * Composant pour afficher la liste de tous les commerciaux
 * Permet de modifier ou supprimer des commerciaux
 * @returns {JSX.Element} La liste des commerciaux avec actions
 */
export default function PageListeCom() {

    const router = useRouter();
    const [liste, setListe] = useState([])

    useEffect(() => {
        /**
         * Récupère la liste de tous les commerciaux depuis l'API
         */
        async function liste() {
            try {
                const res = await fetch('/api/recup_commerciale') 
                const data = await res.json()
                if (res.ok) {
                    setListe(data)
                }
            } catch (err) { console.error(err) }
        }
        liste()
    }, [])

    /**
     * Supprime un commercial après confirmation
     * @param {number} id - L'ID du commercial à supprimer
     * @param {string} nom - Le login du commercial à supprimer
     */
    async function Suppr(id, nom) {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer le commercial "${nom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/supprcom', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(com => com.id !== id));
                    Swal.fire(
                        'Supprimé !',
                        'Commercial supprimé avec succès !',
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
                    "Erreur de connexion au serveur",
                    'error'
                );
            }
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Liste des Commerciaux</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Identifiant</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((com) => (
                                <tr key={com.id}>
                                    <td data-label="Identifiant">{com.login}</td>
                                    <td data-label="Action">
                                        <button className='but' onClick={() => router.push(`/pageModifCom?id=${com.id}`)}>Modifier</button>
                                        <button className='but' onClick={() => Suppr(com.id, com.login)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {liste.length === 0 && <p>Aucun commercial trouvé.</p>}
            </div>
        </>
    )
}