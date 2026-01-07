'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function PageListeMoe() {

    const router = useRouter();
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
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer le MOE "${nom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#0a60b0ff',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
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
                    Swal.fire(
                        'Supprimé !',
                        "Maître d'Oeuvre supprimé !",
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
                <h1>Liste des Maîtres d'Oeuvre</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Prénom</th>
                                <th>Login</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((moe) => (
                                <tr key={moe.nomoe}>
                                    <td data-label="Nom">{moe.nommoe}</td>
                                    <td data-label="Prénom">{moe.prenommoe}</td>
                                    <td data-label="Login">{moe.login}</td>
                                    <td data-label="Action">
                                        <button className='but' onClick={() => router.push(`/pageModifMoe?id=${moe.nomoe}`)}>Modifier</button>
                                        <button className='but' onClick={() => Suppr(moe.nomoe, moe.nommoe, moe.login)}> Supprimer </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {liste.length === 0 && <p>Aucun maître d'oeuvre trouvé.</p>}
            </div>
            <Footer />
        </>
    )
}
