'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

/**
 * Composant pour modifier les informations d'un commercial
 * Charge les données du commercial et permet de modifier le login et le mot de passe
 * @returns {JSX.Element} Le formulaire de modification de commercial
 */
export default function ModifCommercial() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idCom = searchParams.get('id');
    const [login, setLogin] = useState("");
    const [mdp, setMdp] = useState("");

    useEffect(() => {
        if (!idCom) {
            router.push('/pageListeCom');
            return;
        }
        /**
         * Charge les données du commercial depuis l'API
         */
        async function charger() {
            try {
                const res = await fetch('/api/recup_un_commercial', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: idCom })
                });

                if (res.ok) {
                    const data = await res.json();
                    setLogin(data.login || "");
                    setMdp(data.mot_de_passe || "");
                } else {
                    Swal.fire('Erreur', 'Commercial introuvable', 'error');
                    router.push('/pageListeCom');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Erreur', 'Problème serveur', 'error');
            }
        }
        charger();
    }, [idCom, router]);

    /**
     * Valide et soumet les modifications du commercial
     * Vérifie que tous les champs sont remplis, puis appelle l'API pour mettre à jour
     * @param {Event} e - L'événement de soumission du formulaire
     */
    async function validerModif(e) {
        e.preventDefault();
        if (!login || !mdp) {
            Swal.fire('Attention', 'Tous les champs sont requis', 'warning');
            return;
        }

        try {
            const res = await fetch('/api/maj_commercial', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idCom,
                    login: login,
                    mot_de_passe: mdp
                })
            });

            if (res.ok) {
                await Swal.fire('Succès', 'Commercial mis à jour', 'success');
                router.push('/pageListeCom');
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
                <h1>Modifier le Commercial N°{idCom}</h1>
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
        </>
    )
}
