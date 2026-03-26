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
    const [mail, setMail] = useState("");

    useEffect(() => {
        if (!idMoe) {
            router.push('/pageListeUtilisateurs'); // Ajuste la route si besoin
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
                    setMail(data.mail || ""); // On récupère bien le mail maintenant !
                } else {
                    Swal.fire('Erreur', "Maître d'œuvre introuvable", 'error');
                    router.push('/pageListeUtilisateurs');
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
        
        // On vérifie que les 3 champs sont remplis
        if (!nom || !prenom || !mail) {
            Swal.fire('Attention', 'Tous les champs (y compris le mail) sont requis', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/maj_moe', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idMoe,
                    nom: nom,
                    prenom: prenom,
                    mail: mail // On envoie le mail à la place du mdp
                })
            });

            if (res.ok) {
                await Swal.fire('Succès', "Maître d'œuvre mis à jour", 'success');
                router.push('/pageListeUtilisateurs');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Échec de la mise à jour", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', 'Erreur serveur', 'error');
        }
    }

    return (
        <div className="bulle">
            <h1>Modifier le Maître d'Œuvre N°{idMoe}</h1>
            <form>
                <label>Nom :</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                
                <label>Prénom :</label>
                <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} />

                <label>Email :</label>
                <input type="text" value={mail} onChange={(e) => setMail(e.target.value)} placeholder='Adresse email...' />
                
                <div className="form-buttons">
                    <button type="button" className="but" onClick={validerModif}>Enregistrer</button>
                    <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                </div>
            </form>
        </div>
    )
}