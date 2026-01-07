'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function ModifAdmin() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idAdmin = searchParams.get('id');
    const [login, setLogin] = useState("");
    const [mdp, setMdp] = useState("");

    useEffect(() => {
        if (!idAdmin) {
            router.push('/pageListeAdmin');
            return;
        }
        async function charger() {
            try {
                const res = await fetch('/api/recup_un_admin', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: idAdmin })
                });

                if (res.ok) {
                    const data = await res.json();
                    setLogin(data.login || "");
                    setMdp(data.mot_de_passe || "");
                } else {
                    Swal.fire('Erreur', 'Administrateur introuvable', 'error');
                    router.push('/pageListeAdmin');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Erreur', 'Problème serveur', 'error');
            }
        }
        charger();
    }, [idAdmin, router]);

    async function validerModif(e) {
        e.preventDefault();
        if (!login || !mdp) {
            Swal.fire('Attention', 'Tous les champs sont requis', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/maj_admin', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idAdmin,
                    login: login,
                    mot_de_passe: mdp
                })
            });

            if (res.ok) {
                await Swal.fire('Succès', 'Administrateur mis à jour', 'success');
                router.push('/pageListeAdmin');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Echec mise à jour", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', 'Erreur serveur', 'error');
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Modifier l'Administrateur N°{idAdmin}</h1>
                <form>
                    <label>Identifiant (Login) :</label>
                    <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} />
                    
                    <label>Mot de passe :</label>
                    <input type="text" value={mdp} onChange={(e) => setMdp(e.target.value)} />
                    
                    <div className="form-buttons">
                        <button type="button" className="but" onClick={validerModif}>Enregistrer</button>
                        <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}
