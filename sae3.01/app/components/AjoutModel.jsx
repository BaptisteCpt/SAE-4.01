'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';

/**
 * Composant pour créer un nouveau modèle de maison
 * Permet de définir le nom, la description et les étapes de construction du modèle
 * @returns {JSX.Element} Le formulaire de création de modèle
 */
export default function PageAjoutModele() {
    const router = useRouter();
    const [nom, setNom] = useState("");
    const [description, setDescription] = useState("");
    const [toutesLesEtapes, setToutesLesEtapes] = useState([]);
    const [etapesSelectionnees, setEtapesSelectionnees] = useState([]);
    useEffect(() => {
        /**
         * Récupère la liste de toutes les étapes disponibles depuis l'API
         */
        async function recupetape() {
            try {
                const res = await fetch('/api/recup_etapes');
                if (res.ok) {
                    const data = await res.json();
                    // Élimine les doublons en utilisant une Map avec noetape comme clé
                    // Map garantit l'unicité des clés, puis on récupère les valeurs
                    const etapesUniques = Array.from(new Map(data.map(item => [item.noetape, item])).values());
                    setToutesLesEtapes(etapesUniques);
                }
            } catch (err) {
                console.error(err);}
        }
        recupetape();
    }, []);
    /**
     * Gère la sélection/désélection d'une étape pour le modèle
     * @param {number} idEtape - L'ID de l'étape à cocher/décocher
     */
    function cocher(idEtape) {
        if (etapesSelectionnees.includes(idEtape)) {
            setEtapesSelectionnees(prev => prev.filter(id => id !== idEtape));
        } else {
            setEtapesSelectionnees(prev => [...prev, idEtape]);
        }
    }
    /**
     * Valide et soumet le formulaire de création de modèle
     * Vérifie que le nom est rempli, puis appelle l'API pour créer le modèle
     * @param {Event} e - L'événement de soumission du formulaire
     */
    async function validerForm(e) {
        e.preventDefault();
        if (!nom) {
            Swal.fire('Erreur', 'Le nom est obligatoire', 'warning');
            return;
        }
        try {
            const etapesAvecDuree = etapesSelectionnees.map(id => {
                const etapeInfo = toutesLesEtapes.find(e => e.noetape === id);
                return { 
                    id: id, 
                    jours: etapeInfo ? (etapeInfo.nbjoursrealisation || etapeInfo.duree || 1) : 1 
                };
            });

            const res = await fetch('/api/cre_model', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nom: nom,
                    description: description,
                    etapes: etapesAvecDuree
                })
            });
            if (res.ok) {
                await Swal.fire('Succès', 'Modèle créé avec succès', 'success');
                router.push('/pageListeModel');
            } else {
                const info = await res.json();
                Swal.fire('Erreur', info.error || "Échec de la création", 'error');
            }
        } catch (err) {
            Swal.fire('Erreur', "Erreur serveur", 'error');
        }
    }
    return (
        <>
            <div className="bulle">
                <h1>Nouveau Modèle</h1>
                <form>
                    <label>Nom du Modèle :</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder=" Maison 3..." />
                    <label>Description :</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description..."/>
                    <label>Étapes :</label>
                    <div className="etapes-container">
                        {toutesLesEtapes.map((etape) => (
                            <div key={etape.noetape} className="etape-item" onClick={() => cocher(etape.noetape)} style={{cursor:'pointer'}}>
                                <input type="checkbox" id={`etape-${etape.noetape}`} checked={etapesSelectionnees.includes(etape.noetape)} readOnly style={{pointerEvents:'none'}}/>
                                <span style={{marginLeft:'10px'}}>{etape.nometape}</span>
                            </div>))}
                    </div>
                    <div className="form-buttons">
                        <button type="button" className="but" onClick={validerForm}>Créer</button>
                        <button type="button" className="but" onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
            </div>
        </>
    )
}