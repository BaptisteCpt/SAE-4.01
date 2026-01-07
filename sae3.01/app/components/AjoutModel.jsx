'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
export default function PageAjoutModele() {
    const router = useRouter();
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [toutesLesEtapes, setToutesLesEtapes] = useState([]);
    const [etapesSelectionnees, setEtapesSelectionnees] = useState([]);
    useEffect(() => {
        async function recupetape() {
            try {
                const res = await fetch('/api/recup_etapes');
                if (res.ok) {
                    const data = await res.json();const etapesUniques = Array.from(new Map(data.map(item => [item.noetape, item])).values());
                    setToutesLesEtapes(etapesUniques);
                }
            } catch (err) {
                console.error(err);}
        }
        recupetape();
    }, []);
    function cocher(idEtape) {
        if (etapesSelectionnees.includes(idEtape)) {
            setEtapesSelectionnees(prev => prev.filter(id => id !== idEtape));
        } else {
            setEtapesSelectionnees(prev => [...prev, idEtape]);
        }
    }
    async function validerForm(e) {
        e.preventDefault();
        if (!nom) {
            Swal.fire('Erreur', 'Le nom est obligatoire', 'warning');
            return;
        }
        try {
            const res = await fetch('/api/cre_model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: nom,
                    description: description,
                    etapes: etapesSelectionnees
                })
            });
            if (res.ok) {
                await Swal.fire('Succès', 'Modèle créé avec succès', 'success');
                router.push('/pageListeModel');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Echec création", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', "Erreur serveur", 'error');
        }
    }
    return (
        <div className="bulle">
            <h1>Nouveau Modèle</h1>
            <form>
                <label>Nom du Modèle :</label>
                <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder=" Maison 3..." />
                <label>Description :</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..."/>
                <label>Étapes :</label>
                <div>
                    {toutesLesEtapes.map((etape) => (
                        <div key={etape.noetape}>
                            <input type="checkbox" id={`etape-${etape.noetape}`} checked={etapesSelectionnees.includes(etape.noetape)} onChange={() => cocher(etape.noetape)}/>
                            <label>{etape.nometape}</label>
                        </div>))}
                </div>
                <div>
                    <button type="button" className="but" onClick={validerForm}>Creer</button>
                    <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                </div>
            </form>
        </div>
    )
}