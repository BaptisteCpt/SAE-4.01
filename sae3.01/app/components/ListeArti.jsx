'use client'

import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2';

export default function PageListeArti() {

    const [liste, setListe] = useState([])

    useEffect(() => {
        async function recupListe() {
            try {
                const res = await fetch('/api/recup_arti_bis')
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        recupListe()
    }, [])

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
        <div className="bulle">
            <h1>Liste des Artisans</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Ville</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((arti) => (
                        <tr key={arti.noartisan}>
                            <td>{arti.nomartisan}</td>
                            <td>{arti.prenomartisan}</td>
                            <td>{arti.villeartisan}</td>
                            <td>
                                <button className='but' onClick={() => Suppr(arti.noartisan, arti.nomartisan)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {liste.length === 0 && <p>Aucun artisan trouvé.</p>}
        </div>
    )
}