'use client'
import React, { useEffect, useState } from 'react'
export default function ListeCommerciaux() {
    const [liste, setListe] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function recupliste() {
            try {
                const res = await fetch('/api/recup_moe')
                
                if (!res.ok) {
                    setError('Erreur récupération')
                }

                const data = await res.json()
                setListe(data)
            } catch (err) {
                console.error(err)
                setError("Erreur Serveur")
            }
        }

        recupliste()
    }, [])

    if (liste.length === 0) {
        return (
            <div className="bulle">
                <h1>Maitre d'oeuvre</h1>
                <p>Aucun MOE trouvé.</p>
            </div>
        )
    }

    return (
        <div className="bulle">
            <h1>Maitre D'oeuvre</h1>

            <table>
                <thead>
                    <tr>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Login</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((user) => (
                        <tr key={user.nomoe}>
                            <td>{user.nommoe}</td>
                            <td>{user.prenommoe}</td>
                            <td>{user.login}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}