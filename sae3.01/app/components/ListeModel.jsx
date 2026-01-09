'use client'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';

/**
 * Composant pour afficher la liste de tous les modèles de maison
 * Permet de modifier ou supprimer des modèles
 * @returns {JSX.Element} La liste des modèles avec actions
 */
export default function PageListeModele() {
    const [liste, setListe] = useState([])
    const router = useRouter();
    useEffect(() => {
        /**
         * Charge la liste de tous les modèles depuis l'API
         */
        async function charger() {
            try {
                const res = await fetch('/api/recup_model')
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        charger()
    }, [])
    /**
     * Supprime un modèle après confirmation
     * @param {number} id - L'ID du modèle à supprimer
     * @param {string} nom - Le nom du modèle à supprimer
     */
    async function Suppr(id, nom) {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Supprimer le modèle "${nom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Oui, supprimer !'
        });
        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/supprmodel', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });
                if (res.ok) {
                    setListe(prev => prev.filter(m => m.nomodele !== id));
                    Swal.fire('Supprimé !', 'Le modèle a été supprimé.', 'success');
                } else {
                    const info = await res.json();
                    Swal.fire('Erreur', info.error || "Impossible de supprimer", 'error');
                }
            } catch (err) {
                Swal.fire('Erreur', "Erreur serveur", 'error');
            }
        }
    }
    return (
        <>
            <div className="bulle">
                <h1>Liste des Modèles</h1>
                <div>
                    <button className="but" onClick={() => router.push('/pageAjoutModel')}>
                        Nouveau Modèle
                    </button>
                </div>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Description</th>
                                <th>Étapes incluses</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((m) => (
                                <tr key={m.nomodele}>
                                    <td data-label="Nom">{m.nommodele}</td>
                                    <td data-label="Description">{m.descriptionmodele || "..."}</td>
                                    <td data-label="Étapes incluses">
                                        {m.etapes && m.etapes.length > 0 ? (
                                            <ul>
                                                {m.etapes.map(e => <li key={e.noetape}>{e.nometape}</li>)}
                                            </ul>
                                        ) : <p>Aucune Étapes</p>}
                                    </td>
                                    <td data-label="Modifier/Supprimer">
                                        <button className='but' onClick={() => router.push(`/pageModifModel?id=${m.nomodele}`)}>Modifier
                                        </button>
                                        <button className='but' onClick={() => Suppr(m.nomodele, m.nommodele)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {liste.length === 0 && <p>Aucun modèle trouvé.</p>}
            </div>
        </>
    )
}