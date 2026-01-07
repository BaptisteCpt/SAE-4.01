'use client'
import React, { useState, useEffect } from 'react'
export default function PageListAdmin() {

    const [liste, setListe] = useState([])
    useEffect(() => {
        async function Liste() {
            try {
                const res = await fetch('/api/recup_admin') 
                const data = await res.json()
                if (res.ok) setListe(data)
            } catch (err) { console.error(err) }
        }
        Liste()
    }, [])

    async function Suppr(id, loginDeLaLigne) {
        const monLoginActuel = localStorage.getItem("nom");
        if (monLoginActuel && loginDeLaLigne) {
            if (monLoginActuel.toLowerCase() === loginDeLaLigne.toLowerCase()) {
                alert("Action impossible : Vous ne pouvez pas supprimer votre propre compte !");
                return; 
            }
        }
        const confirmation = window.confirm(`Voulez-vous vraiment supprimer l'administrateur "${login}" ?`);
        if (confirmation) {
            try {
                const res = await fetch('/api/suppradmin', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });
                if (res.ok) {
                    setListe(prevListe => prevListe.filter(user => user.id !== id));
                    alert("Administrateur supprimé !");
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
            <h1>Liste des Administrateurs</h1>
            
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Login</th>
                        <th>Rôle</th>
                    </tr>
                </thead>
                <tbody>
                    {liste.map((admin) => (
                        <tr key={admin.id}>
                            <td>{admin.id}</td>
                            <td>{admin.login}</td>
                            <td>{admin.role}</td>
                            <td>
                                <button className='but'onClick={() => Suppr(admin.id, admin.login)}>Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {liste.length === 0 && <p>Aucun administrateur trouvé.</p>}
        </div>
    )
}