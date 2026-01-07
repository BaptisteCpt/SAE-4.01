'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function PageListeCom() {

    const router = useRouter();
    const [liste, setListe] = useState([])

    useEffect(() => {
        async function liste() {
            try {
                const res = await fetch('/api/recup_commerciale') 
                const data = await res.json()
                if (res.ok) {
                    setListe(data)
                }
            } catch (err) { console.error(err) }
        }
        liste()
    }, [])

    async function Suppr(id, nom) {
        const result = await Swal.fire({
            title: 'Êtes-vous sûr ?',
            text: `Voulez-vous vraiment supprimer le commercial "${nom}" ?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Oui, supprimer !',
            cancelButtonText: 'Annuler'
        });

        if (result.isConfirmed) {
            try {
                const res = await fetch('/api/supprcom', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: id }),
                });

                if (res.ok) {
                    setListe(prevListe => prevListe.filter(com => com.id !== id));
                    Swal.fire(
                        'Supprimé !',
                        'Commercial supprimé avec succès !',
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
                    "Erreur de connexion au serveur",
                    'error'
                );
            }
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Liste des Commerciaux</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Identifiant</th>
                                <th>Mot de passe</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {liste.map((com) => (
                                <tr key={com.id}>
                                    <td data-label="Identifiant">{com.login}</td>
                                    <td data-label="Mot de passe">{com.mot_de_passe}</td>
                                    <td data-label="Action">
                                        <button className='but' onClick={() => router.push(`/pageModifCom?id=${com.id}`)}>Modifier</button>
                                        <button className='but' onClick={() => Suppr(com.id, com.login)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {liste.length === 0 && <p>Aucun commercial trouvé.</p>}
            </div>
            <Footer />
        </>
    )
}