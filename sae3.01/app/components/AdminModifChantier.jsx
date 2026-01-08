'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';

export default function PageModifChantier() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idChantier = searchParams.get('id');
    const [adresse, setAdresse] = useState("");
    const [ville, setVille] = useState("");
    const [cp, setCp] = useState("");
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedModele, setSelectedModele] = useState("");
    const [selectedMoe, setSelectedMoe] = useState("");
    const [clients, setClients] = useState([]);
    const [modeles, setModeles] = useState([]);
    const [moes, setMoes] = useState([]);

    useEffect(() => {
        if (!idChantier) {
            router.push('/pageListeChantier');
            return;
        }
        async function chargerDonnees() {
            try {
                const [resCli, resMod, resMoe, resChantier] = await Promise.all([
                    fetch('/api/recup_client'), 
                    fetch('/api/modele_maison'), 
                    fetch('/api/recup_moe'),    
                    fetch('/api/recup_un_chantier', { 
                        method: 'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify({ id: idChantier })
                    })
                ]);
                if (resCli.ok) setClients(await resCli.json());
                if (resMod.ok) setModeles(await resMod.json());
                if (resMoe.ok) setMoes(await resMoe.json());
                if (resChantier.ok) {
                    const data = await resChantier.json();
                    setAdresse(data.adressechantier || "");
                    setVille(data.villechantier || "");
                    setCp(data.cpchantier || "");
                    setSelectedClient(data.noclient || "");
                    setSelectedModele(data.nomodele || "");
                    setSelectedMoe(data.nomoe || "");
                } else {
                    Swal.fire('Erreur', 'Chantier introuvable', 'error');
                    router.push('/pageListeChantier');
                }
            } catch (err) {
                console.error(err);
                Swal.fire('Erreur', 'Problème de connexion serveur', 'error');
            }
        }
        chargerDonnees();
    }, [idChantier, router]);
    async function validerModif(e) {
        e.preventDefault();
        if (!adresse || !ville || !cp || !selectedClient) {
            Swal.fire({
                title: 'Champs manquants',
                text: "Veuillez remplir au moins l'adresse et le client",
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }
        try {
            const res = await fetch('/api/maj_chantier', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idChantier,
                    adresse: adresse,
                    cp: cp,
                    ville: ville,
                    client: selectedClient,
                    modele: selectedModele,
                    moe: selectedMoe
                })
            });

            if (res.ok) {
                await Swal.fire({
                    title: 'Succès !',
                    text: 'Le chantier a été modifié avec succès.',
                    icon: 'success',
                    confirmButtonText: 'Retour à la liste'
                });
                router.push('/pageAdminChantier');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Erreur lors de la modification", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', "Erreur serveur", 'error');
        }
    }

    return (
        <>
            <div className="bulle">
                <h1>Modifier le Chantier N°{idChantier}</h1>
                
                <form>
                    <label>Client :</label>
                    <select value={selectedClient} onChange={(e) => setSelectedClient(e.target.value)}>
                        <option value="">-- Sélectionner un client --</option>
                        {clients.map(c => (
                            <option key={c.noclient} value={c.noclient}>{c.nomclient} {c.prenomclient}</option>
                        ))}
                    </select>

                    <label>Adresse :</label>
                    <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
                    <label>Code Postal :</label>
                    <input type="text" value={cp} onChange={(e) => setCp(e.target.value)} />
                    <label>Ville :</label>
                    <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} />
                    <label>Modèle de Maison :</label>
                    <select value={selectedModele} onChange={(e) => setSelectedModele(e.target.value)}>
                        <option value="">-- Sélectionner un modèle --</option>
                        {modeles.map(m => (
                            <option key={m.nomodele} value={m.nomodele}>{m.nommodele}</option>
                        ))}
                    </select>

                    <label>Maître d'Oeuvre :</label>
                    <select value={selectedMoe} onChange={(e) => setSelectedMoe(e.target.value)}>
                        <option value="">-- Sélectionner un MOE --</option>
                        {moes.map(m => (
                            <option key={m.nomoe} value={m.nomoe}>{m.nommoe} {m.prenommoe}</option>
                        ))}
                    </select>

                    <div className="form-buttons">
                        <button type="button" className="but" onClick={validerModif}>Enregistrer</button>
                        <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
            </div>
        </>
    )
}
