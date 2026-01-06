'use client'
import React, { useEffect, useState } from 'react'
export default function ListeCommerciaux() {
    const [liste, setListe] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function recupliste() {
            try {
                const res = await fetch('/api/recup_artisan')
                
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
                <h1>Artisant</h1>
                <p>Aucun Artisant trouvé.</p>
            </div>
        )
    }

    return (
        <div className="bulle">
            <h1>Artisant</h1>

            <table>
                <thead>
                    <tr>
                        <th>Numéro Artisant</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Adresse</th>
                        <th>Code Postal</th>
                        <th>Ville</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((user) => (
                        <tr key={user.noartisan}>
                            <td>{user.noartisan}</td>
                            <td>{user.nomartisan}</td>
                            <td>{user.prenomartisan}</td>
                            <td>{user.adresseartisan}</td>
                            <td>{user.cpartisan}</td>
                            <td>{user.villeartisan}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}