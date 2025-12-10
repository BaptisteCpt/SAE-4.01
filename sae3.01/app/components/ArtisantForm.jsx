'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function ArtisantForm() {
    const[nom, setNom] = useState("");
    const[prenom, setPrenom] = useState("");
    const[competence, setCompetence] = useState("");
    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const[numero_etape, setNumeroEtape] = useState();
    const [error,setError] = useState()

    const fetchedChantiers = useRef(false);


    async function fetchEtapes(numero) {
        try {
          const res = await fetch('/api/numero_etape', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ numero_chantier: numero })
          });
      
          if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
          
          const data = await res.json();
          setEtapes(data);
        } catch (err) {
          console.error('Erreur lors de la récupération des étapes', err);
          setError("Impossible de récupérer les étapes");
        }
      }
      

    useEffect(() => {
        if (fetchedChantiers.current) return;
        fetchedChantiers.current = true;

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

  return (
    <div className='BulleDuFormulaire'>

        <h1>Nouvelle Affectation</h1>

        <form>
            <label>
                Chantier Choisi :
                <select name="chantier_choisi" value={numero_chantier} onChange={e => {setNumeroChantier(e.target.value); fetchEtapes(e.target.value);}}>
                        <option value="" hidden>-- Numéro du chantier --</option>
                            {Chantiers.map((Chantier) => (
                                <option key={Chantier.nochantier} value={Chantier.nochantier}>{Chantier.nochantier} - {Chantier.adressechantier}</option>
                                ))}
                </select>            
            </label>
            <br />
            <label>
                Nom Etape:
                <select name="etape_choisi" value={numero_etape} onChange={e => setNumeroEtape(e.target.value)}>
                        <option value="" hidden>-- Etape à sélectionner --</option>
                            {/*Etapes.map((etape) => (
                                <option key={etape.nomodele} value={etape.nommodele}>{etape.nommodele}</option>
                            ))*/}
                </select> 
            </label>
            
            <br />
            <hr/>

            <h1>Coordonées de l'artisant :</h1>
            <br/>

            <label>
                Nom:
                <input type="text" name="Nom" placeholder="Nom..." value={nom} onChange={(e) => setNom(e.target.value)}/>
            </label>
            <br />
            <label>
                Prénom:
                <input type="text" name="Prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)}/>
            </label>
            <br />
            <label>
                Compétence:
                <input type="text" name="Compétence" placeholder="Compétence de l'artisant" value={competence} onChange={(e) => setCompetence(e.target.value)}/>
            </label>
           
            <br />
            <button type="button" >Valider</button>
        </form>

        {error && <p>{error}</p>}


    </div>
  )
}
