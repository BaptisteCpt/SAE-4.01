'use client'

import React, { useState, useEffect } from 'react'
import '../css/appel.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

/**
 * Composant pour gérer les appels de fonds d'un chantier
 * Permet de visualiser et de marquer comme payés les appels de fonds
 * @returns {JSX.Element} La page de gestion des appels de fonds
 */
export default function Appel() {

    const [appels, setAppels] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const [Chantiers,setChantiers] = useState([]);
    const router = useRouter();


    /**
     * Charge la liste des chantiers au chargement du composant
     * Vérifie aussi si un chantier a été sauvegardé dans le localStorage (après rechargement)
     */
    useEffect(() => {
        // Récupère un chantier sauvegardé depuis une navigation précédente
        // Permet de restaurer la sélection après un rechargement de page
        const reloadChantier = localStorage.getItem('chantier');
        if (reloadChantier) {
            setNumeroChantier(reloadChantier);
            // Supprime la valeur du localStorage après l'avoir utilisée (nettoyage)
            localStorage.removeItem('chantier');
        }

        /**
         * Récupère la liste de tous les chantiers depuis l'API
         */
        async function fetchChantier(){
            try {
                const res =  await fetch('/api/numero_chantier');
                const model = await res.json();
                setChantiers(model);
            } catch (err){
                console.error('Erreur lors de la récuperation des chantiers', err)
            }
        }
        fetchChantier();
    }, []);

    /**
     * Charge les appels de fonds du chantier sélectionné
     * Se déclenche automatiquement quand un chantier est sélectionné
     */
    useEffect(()=>{
        if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
        /**
         * Récupère les appels de fonds du chantier sélectionné depuis l'API
         */
        async function fetchAppel(){
            try {
                // Utilise un paramètre de requête pour filtrer par chantier
                const res =  await fetch(`/api/appels?chantier=${numero_chantier}`);
                const data = await res.json();
                setAppels(data);
            } catch (err){
                console.error('Erreur lors de la récuperation des appels de fonds', err)
            }
        }
        fetchAppel();
    }, [numero_chantier]); // Se déclenche à chaque changement de numero_chantier

    /**
     * Marque un appel de fonds comme payé en enregistrant la date de règlement
     * @param {number} noappel - Le numéro de l'appel à marquer comme payé
     */
    const payer = async (noappel) => {
        // Utilise la date actuelle comme date de règlement
        const aujourdhui = new Date();
        try {
            const response = await fetch('/api/sauv_appel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numero_chantier,
                    noappel: noappel,
                    date: aujourdhui // Date de règlement = date actuelle
                })
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oups...',
                    text: result.error,
                    confirmButtonText: 'OK'
                })
            } else {
                Swal.fire({
                    icon: 'success',
                    title: 'Réussi',
                    text: "Appel payé",
                    confirmButtonText: 'OK'
                }).then(() => {
                    // Sauvegarde le chantier dans le localStorage pour le restaurer après rechargement
                    localStorage.setItem("chantier",numero_chantier);
                    // Recharge la page pour afficher la date de règlement mise à jour
                    window.location.reload();
                });
            }
        } catch (error) {
            console.error(error);
        }        
    }

    return (
        <div className="artisan">
            <div className="appelForm">
                <div className="BulleArtisan">
                    <h1>Appels de fonds</h1>
    
                    <label className="full-width">
                        Chantier Choisi :
                        <select
                            className="select-chantier"
                            value={numero_chantier}
                            onChange={e => setNumeroChantier(Number(e.target.value))}
                        >
                            <option value="" hidden>
                                -- Sélectionnez un chantier --
                            </option>
                            {Chantiers.map((Chantier) => (
                                <option
                                    key={Chantier.nochantier}
                                    value={Chantier.nochantier}
                                >
                                    {Chantier.nochantier} - {Chantier.adressechantier}
                                </option>
                            ))}
                        </select>
                    </label>
    
                    {numero_chantier && (
                        <>
    
                            {appels.length > 0 ? (
                                appels.map((appel) => (
                                    <article className="appel-card" key={appel.noappel}>
                                        <div className="appel-header">
                                            <span>Appel n° {appel.noappel}</span>
                                            <span className="appel-montant">
                                                {appel.montantappel} €
                                            </span>
                                        </div>
    
                                        <div className="appel-grid">
                                            <div>
                                                <label>Date d’émission</label>
                                                <input
                                                    type="date"
                                                    value={appel.dateappel.slice(0, 10)}
                                                    readOnly
                                                />
                                            </div>
    
                                            <div>
                                                <label>Date de règlement</label>
                                                {appel.datereglappel ? (
                                                    <input
                                                        type="date"
                                                        value={appel.datereglappel.slice(0, 10)}
                                                        readOnly
                                                    />
                                                ) : (
                                                    <>
                                                        <span className="attente">
                                                            En attente
                                                        </span>
                                                        <button 
                                                            className="btn-payer"
                                                            onClick={()=>(payer(appel.noappel))}>
                                                            Marqué comme payé
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </article>
                                ))
                            ) : (
                                <p className="no-data">
                                    Aucun appel pour ce chantier
                                </p>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}    
