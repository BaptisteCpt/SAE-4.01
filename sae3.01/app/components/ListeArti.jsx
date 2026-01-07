'use client'

import React, { useState, useEffect } from 'react'

export default function PageListeArti() {

    const [liste, setListe] = useState([])

    useEffect(() => {
        async function recupListe() {
            try {
                const res = await fetch('/api/recup_artisan')
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        recupListe()
    }, [])

    async function Suppr(id, nom) {

        const confirmation = window.confirm(`Voulez-vous vraiment supprimer l'artisan "${nom}" ?\nCette action est irréversible.`);

        if (confirmation) {
            try {
                const res = await fetch('/api/supprartisant', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(artisan => artisan.noartisan !== id));
                    alert("Suppression réussie !");
                } else {
                    const info = await res.json();
                    alert("Impossible de supprimer");
                }
            } catch (err) {
                console.error(err);
                alert("Erreur de connexion serveur");
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