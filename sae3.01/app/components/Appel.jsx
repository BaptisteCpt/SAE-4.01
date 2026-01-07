'use client'

import React, { useState, useEffect, useRef } from 'react'
import '../css/appel.css';

export default function Appel() {

    const [appels, setAppels] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const [Chantiers,setChantiers] = useState([]);


    useEffect(() => { // Chargement des chantier et récupérations dans la liste chantiers
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

    useEffect(()=>{
        if (!numero_chantier) return;
        async function fetchAppel(){
            try {
                const res =  await fetch(`/api/appels?chantier=${numero_chantier}`);
                const data = await res.json();
                setAppels(data);
            } catch (err){
                console.error('Erreur lors de la récuperation des appels de fonds', err)
            }
        }
        fetchAppel();
    }, [numero_chantier]);

    return (
        <div className="artisan">
            <div className="appelForm">
                <div className="BulleArtisan">
                    <h1>Appels de fonds</h1>
    
                    <label className="full-width">
                        Chantier Choisi :
                        <select
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
                            <hr />
    
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
                                                    <span className="attente">
                                                        En attente
                                                    </span>
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
