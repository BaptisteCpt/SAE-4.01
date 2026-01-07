'use client'

import React, { useState, useEffect } from 'react'
export default function PageListeMoe() {

    const [liste, setListe] = useState([])
    
    useEffect(() => {
        async function Liste() {
            try {
                const res = await fetch('/api/recup_moe')
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        Liste()
    }, [])

    async function Suppr(id, nom, login) {
        const confirmation = window.confirm(`Voulez-vous vraiment supprimer le MOE "${nom}" ?`);

        if (confirmation) {
            try {
                const res = await fetch('/api/supprmoe', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        id: id,
                        login: login
                    }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(moe => moe.nomoe !== id));
                    alert("Maître d'Oeuvre supprimé !");
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
            <h1>Liste des Maîtres d'Oeuvre</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Login</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((moe) => (
                        <tr key={moe.nomoe}>
                            <td>{moe.nommoe}</td>
                            <td>{moe.prenommoe}</td>
                            <td>{moe.login}</td>
                            <td>
                                <button className='but' onClick={() => Suppr(moe.nomoe, moe.nommoe, moe.login)}> Supprimer </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {liste.length === 0 && <p>Aucun maître d'oeuvre trouvé.</p>}
        </div>
    )
}