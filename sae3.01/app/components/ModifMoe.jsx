'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function ModifMoe() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idMoe = searchParams.get('id');
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");

    useEffect(() => {
        if (!idMoe) {
            router.push('/pageListeMoe');
            return;
        }
        async function charger() {
            try {
                const res = await fetch('/api/recup_un_moe', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: idMoe })
                });

                if (res.ok) {
                    const data = await res.json();
                    setNom(data.nommoe || "");
                    setPrenom(data.prenommoe || "");
                } else {
                    Swal.fire('Erreur', "Maître d'œuvre introuvable", 'error');
                    router.push('/pageListeMoe');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Erreur', 'Problème serveur', 'error');
            }
        }
        charger();
    }, [idMoe, router]);

    async function validerModif(e) {
        e.preventDefault();
        if (!nom || !prenom) {
            Swal.fire('Attention', 'Tous les champs sont requis', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/maj_moe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idMoe,
                    nom: nom,
                    prenom: prenom
                })
            });

            if (res.ok) {
                await Swal.fire('Succès', "Maître d'œuvre mis à jour", 'success');
                router.push('/pageListeMoe');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Échec de la mise à jour", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', 'Erreur serveur', 'error');
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Modifier le Maître d'Œuvre N°{idMoe}</h1>
                <form>
                    <label>Nom :</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                    
                    <label>Prénom :</label>
                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    
                    <div className="form-buttons">
                        <button type="button" className="but" onClick={validerModif}>Enregistrer</button>
                        <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
            </div>
        </>
    )
}
