'use client'

import React, { useState, useEffect, useRef } from 'react'

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
        async function fetchAppel(){
            if (!numero_chantier) return;
            try {
                const res =  await fetch(`/api/appels?chantier=${numero_chantier}`);
                const data = await res.json();
                setAppels(data);
            } catch (err){
                console.error('Erreur lors de la récuperation des appels de fonds', err)
            }
        }
        fetchAppel();
    }, []);

  return (
    <div className='appelForm'>
        <h1>Appels de fonds</h1>
        <label className="full-width">
            Chantier Choisi :
            <select value={numero_chantier} onChange={e => {setNumeroChantier(Number(e.target.value))}}>
                <option value="" hidden>-- Sélectionnez un chantier --</option>
                {Chantiers.map((Chantier) => (
                    <option key={Chantier.nochantier} value={Chantier.nochantier}>
                        {Chantier.nochantier} - {Chantier.adressechantier}
                    </option>
                ))}
            </select>            
        </label>
        {
            numero_chantier &&
            <>
                
            </>
        }
    </div>
  )
}
