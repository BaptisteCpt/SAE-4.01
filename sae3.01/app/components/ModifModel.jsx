'use client'

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function ModifModele() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const idModele = searchParams.get('id');
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [toutesEtap, setToutesEtap] = useState([]);
    const [etapesSelect, setEtapesSelect] = useState([]);
    useEffect(() => {
        if (!idModele) {
            router.push('/pageListeModel');
            return;
        }
        async function charger() {
            try {
                const resEtapes = await fetch('/api/recup_etapes');
                if (resEtapes.ok) {
                    const data = await resEtapes.json();
                    const etapesunique = Array.from(new Map(data.map(item => [item.noetape, item])).values());
                    setToutesEtap(etapesunique);
                }
                const resModele = await fetch('/api/recup_un_modele', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ id: idModele })
                });
                if (resModele.ok) {
                    const data = await resModele.json();
                    setNom(data.nommodele || "");
                    setDescription(data.descriptionmodele || "");
                    if (data.etapesIDs) {
                        setEtapesSelect(data.etapesIDs);
                    }
                } else {
                    router.push('/pageListeModel');
                }
            } catch (err) { console.error(err); }}
        charger();
    }, [idModele, router]);

    function chocher(idEtape) {
        if (etapesSelect.includes(idEtape)) {
            setEtapesSelect(prev => prev.filter(id => id !== idEtape));
        } else {
            setEtapesSelect(prev => [...prev, idEtape]);
        }}
    async function validerModif(e) {
        e.preventDefault();
        if (!nom) return Swal.fire('Erreur', 'Nom obligatoire', 'warning');
        try {
            const res = await fetch('/api/maj_model', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: idModele,
                    nom: nom,
                    description: description,
                    etapes: etapesSelect
                })
            });
            if (res.ok) {
                await Swal.fire('Succès', 'Modèle mis à jour', 'success');
                router.push('/pageListeModel');
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
                <h1>Modifier le Modèle N°{idModele}</h1>
                <form>
                    <label>Nom :</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} />
                    <label>Description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="textarea-desc"/>

                    <label>Étapes :</label>
                    <div className="etapes-container">
                        {toutesEtap.map((etape) => (
                            <div key={etape.noetape} className="etape-item" onClick={() => chocher(etape.noetape)} style={{cursor: 'pointer'}}>
                                <input type="checkbox" checked={etapesSelect.includes(etape.noetape)} readOnly style={{pointerEvents: 'none'}}/>
                                <span style={{marginLeft: '10px'}}>{etape.nometape}</span>
                            </div>))}
                    </div>
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
