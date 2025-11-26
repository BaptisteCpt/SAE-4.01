'use client'

import React, { useState, useEffect } from 'react'

export default function ArtisantForm() {
    const[nom, setNom] = useState("");
    const[prenom, setPrenom] = useState("");
    const[competence, setCompetence] = useState("");
    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const[numero_etape, setNumeroEtape] = useState();
    const [error,setError] = useState()


    async function fetchChantier(){
        try {
            const res =  await fetch('/api/numero_chantier');
            const model = await res.json();
            setChantiers(model);
        } catch (err){
            console.error('Erreur lors de la récuperation des chantiers', err)
        }
    }
    
    async function fetchEtape(){
        try {
            const res =  await fetch('/api/#');
            const model = await res.json();
            setEtapes(model)
        } catch (err){
            console.error('Erreur lors de la récuperation des chantiers', err)
        }
    }

    useEffect(() => {
        fetchChantier();
        //fetchEtape();
    }, []);

    console.log(Chantiers);

  return (
    <div className='BulleDuFormulaire'>

        <h1>Nouvelle Affectation</h1>

        <form>
            <label>
                Chantier Choisi :
                <select name="chantier_choisi" value={numero_chantier} onChange={e => setNumeroChantier(e.target.value)}>
                        <option value="" hidden>-- Numéro du chantier --</option>
                            {/* {Chantiers.map((Chantier) => (
                                <option key={Chantier.nochantier} value={Chantier.nochantier}>{Chantier.nommodele}</option>
                                ))} */}
                </select>            
            </label>
            <br />
            <label>
                Nom Etape:
                <select name="etape_choisi" value={numero_etape} onChange={e => setNumeroEtape(e.target.value)}>
                        <option value="" hidden>-- Etape à sélectionner --</option>
                            {/* {Chantiers.map((Chantier) => (
                                <option key={Chantier.nomodele} value={Chantier.nommodele}>{Chantier.nommodele}</option>
                            ))} */}
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
