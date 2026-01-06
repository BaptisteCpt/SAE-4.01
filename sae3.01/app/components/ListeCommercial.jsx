'use client'
import React, { useEffect, useState } from 'react'
export default function ListeCommerciaux() {
    const [liste, setListe] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function recupliste() {
            try {
                const res = await fetch('/api/recup_commerciale')
                
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
                <h1>Commerciale</h1>
                <p>Aucun commercial trouvé.</p>
            </div>
        )
    }

    return (
        <div className="bulle">
            <h1>Commerciale</h1>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.login}</td>
                            <td>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}