'use client'

import React, { useState, useEffect } from 'react'
import '../css/appel.css';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';

export default function Appel() {

    const [appels, setAppels] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const [Chantiers,setChantiers] = useState([]);
    const router = useRouter();


    useEffect(() => { // Chargement des chantier et récupérations dans la liste chantiers

        const reloadChantier = localStorage.getItem('chantier');
        if (reloadChantier) {
            setNumeroChantier(reloadChantier);
            localStorage.removeItem('chantier');
        }

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

    const payer = async (noappel) => {
        const aujourdhui = new Date();
        try {
                    const response = await fetch('/api/sauv_appel', { // on envoie à l'API les données requises pour sauvegarder
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            chantierId: numero_chantier,
                            noappel: noappel,
                            date: aujourdhui
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
                            localStorage.setItem("chantier",numero_chantier);
                            router.push('/appel');
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
                                                    <>
                                                        <span className="attente">
                                                            En attente
                                                        </span>
                                                        <button onClick={()=>(payer(appel.noappel))}>
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
