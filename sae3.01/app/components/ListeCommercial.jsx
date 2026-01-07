'use client'

import React, { useState, useEffect } from 'react'
export default function PageListeCom() {

    const [liste, setListe] = useState([])

    useEffect(() => {
        async function liste() {
            try {
                const res = await fetch('/api/recup_commerciale') 
                const data = await res.json()
                if (res.ok) {
                    setListe(data)
                } else {
                    console.error("Erreur chargement liste")
                }
            } catch (err) { console.error(err) }
        }
        liste()
    }, [])

    async function Suppr(id, nom) {
        const confirmation = window.confirm(`Voulez-vous vraiment supprimer le commercial "${nom}" ?\nCette action est irréversible.`);
        if (confirmation) {
            try {
                const res = await fetch('/api/supprcom', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(com => com.nocommercial !== id));
                    alert("Commercial supprimé avec succès !");
                } else {
                    const info = await res.json();
                    alert("Impossible de supprimer");
                }
            } catch (err) {
                console.error(err);
                alert("Erreur de connexion au serveur");
            }
        }
    }

    return (
        <div className="bulle">
            <h1>Liste des Commerciaux</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((com) => (
                        <tr key={com.id}>
                            <td>{com.login}</td>
                            <td>{com.mot_de_passe}</td>
                            <td>
                                <button className='but' onClick={() => Suppr(com.id, com.login)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {liste.length === 0 && <p>Aucun commercial trouvé.</p>}
        </div>
    )
}