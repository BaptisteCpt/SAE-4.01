'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function artisanForm() {

    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const [Artisans,setArtisans] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const[EtapeCourrante, setEtapeCourrante] = useState();
    const[ArtisanCourrant, setArtisanCourrant] = useState();
    const [error,setError] = useState()

    const fetchedChantiers = useRef(false);
      

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

    useEffect(() => { // Chargement des étapes du chantier selectionner et récupération dans la liste etapes
        async function fetchEtapes() {
            if (!numero_chantier) return;
            try {
                const response = await fetch(`/api/etapes?chantier=${numero_chantier}`);
                const data = await response.json();
                let datatrie;
                if (response.ok) {
                    datatrie = data.filter((etape) => etape.reservee == false);
                    setEtapes(datatrie);
                    if (datatrie.length > 0) setEtapeCourrante(datatrie[0].id); // si on a au moins une étapes on la séléctionne par défaut
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchEtapes();
    }, [numero_chantier]);

    useEffect(() => { // Chargement des artisan qualifié pour l'étape courrante
        async function fetchartisan() {
            if (!EtapeCourrante) return;
            try {
                const response = await fetch(`/api/recup_artisan?etape=${EtapeCourrante}`);
                const data = await response.json();
                if (response.ok) {
                    setArtisans(data);
                    if (data.length > 0){
                        setArtisanCourrant(data[0].noartisan); // si on a au moins un artisan on le séléctionne par défaut
                    }else{
                        setArtisanCourrant(undefined);
                    }
                } else {
                    setArtisans([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchartisan();
    }, [EtapeCourrante]);


    // Sauvegarder dans la base de données
    const Sauvegarder = async () => {
        if (!EtapeCourrante) return; // on verifie qu'on a bien une étape séléctionnée

        try {
            const response = await fetch('/api/sauv_artisan', { // on envoie à l'API les données requises pour sauvegarder
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numero_chantier,
                    etapeId: EtapeCourrante,
                    noartisan: ArtisanCourrant
                })
            });

            const result = await response.json();

            if (!response.ok) {
                alert("Erreur : " + result.error);
            } else {
                alert("Modifications enregistrées !");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur réseau");
        }
    };

  return (
    <div className='BulleDuFormulaire'>

        <h1>Nouvelle Affectation</h1>

            <label>
                Chantier Choisi :
                <select value={numero_chantier} onChange={e => {setNumeroChantier(Number(e.target.value))}}>
                        <option value="" hidden>-- Numéro du chantier --</option>
                            {Chantiers.map((Chantier) => (
                                <option key={Chantier.nochantier} value={Chantier.nochantier}>{Chantier.nochantier} - {Chantier.adressechantier}</option>
                            ))}
                </select>            
            </label>
            <br />
            {   numero_chantier &&
                <>
                    <label>
                        Nom Etape:
                        <select
                            value={EtapeCourrante} 
                            onChange={(e) => setEtapeCourrante(Number(e.target.value))}>
                                {Etapes.map(etape => (
                                    <option key={etape.id} value={etape.id}>{ etape.id } - { etape.nom }</option>
                                ))}
                        </select> 
                    </label>
                    
                    <br />
                    <hr/>

                    <h1>Choix de l'artisan :</h1>
                    <br/>
                    {
                        ArtisanCourrant!==undefined ? (
                            <select
                                value={ArtisanCourrant} 
                                onChange={(e) => setArtisanCourrant(Number(e.target.value))}>
                                    {Artisans.map(artisan => (
                                        <option key={artisan.noartisan} value={artisan.noartisan}>{ artisan.nomartisan } - { artisan.prenomartisan }</option>
                                    ))}
                            </select>
                        ):(
                            <span>Aucun Artisan Trouvé</span>
                        )
                    }
                     
                </>
            }
                <br />
            <button onClick={Sauvegarder}>Valider</button>
        {error && <p>{error}</p>}


    </div>
  )
}
