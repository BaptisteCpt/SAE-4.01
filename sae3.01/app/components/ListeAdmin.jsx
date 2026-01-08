'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function PageListAdmin() {

    const router = useRouter();
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

    async function Suppr(id, login) {
        const monLoginActuel = localStorage.getItem("nom");
        
        if (monLoginActuel && login) {
            if (monLoginActuel.toLowerCase() === login.toLowerCase()) {
                Swal.fire({
                    title: 'Action impossible',
                    text: "Vous ne pouvez pas supprimer votre propre compte !",
                    icon: 'error',
                    confirmButtonText: 'Compris'
                });
                return; 
            }
        }

        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer l'administrateur "${login}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/suppradmin', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(user => user.id !== id));
                    Swal.fire(
                        'Supprimé !',
                        'Administrateur supprimé !',
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
        <>
            <div className="bulle">
                <h1>Liste des Administrateurs</h1>
                
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Login</th>
                                <th>Rôle</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((admin) => (
                                <tr key={admin.id}>
                                    <td data-label="ID">{admin.id}</td>
                                    <td data-label="Login">{admin.login}</td>
                                    <td data-label="Rôle">{admin.role}</td>
                                    <td data-label="Action">
                                        <button className='but' onClick={() => router.push(`/pageModifAdmin?id=${admin.id}`)}>Modifier</button>
                                        <button className='but' onClick={() => Suppr(admin.id, admin.login)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {liste.length === 0 && <p>Aucun administrateur trouvé.</p>}
            </div>
            <Footer />
        </>
    )
}