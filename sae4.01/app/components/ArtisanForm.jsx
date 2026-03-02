'use client'

import React, { useState, useEffect, useRef } from 'react'
import "../css/artisan.css";
import Swal from 'sweetalert2';

/**
 * Composant pour affecter un artisan à une étape d'un chantier
 * Permet de sélectionner un chantier, une étape non réservée, puis un artisan qualifié
 * @returns {JSX.Element} Le formulaire d'affectation d'artisan
 */
export default function artisanForm() {

    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const [Artisans,setArtisans] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const[EtapeCourrante, setEtapeCourrante] = useState(null);
    const[ArtisanCourrant, setArtisanCourrant] = useState();
    const [error,setError] = useState()
      

    /**
     * Charge la liste des chantiers au chargement du composant
     * Vérifie aussi si un chantier et une étape ont été sauvegardés dans le localStorage
     */
    useEffect(() => {
        // Récupère un chantier et une étape sauvegardés depuis une navigation précédente
        // Permet de restaurer la sélection après un rechargement de page
        const chantierGiven = localStorage.getItem('chantier');
        const etapeGiven = localStorage.getItem('etape');
        if (chantierGiven) {
            setNumeroChantier(chantierGiven);
            setEtapeCourrante(etapeGiven);
            // Supprime les valeurs du localStorage après les avoir utilisées (nettoyage)
            localStorage.removeItem('chantier');
            localStorage.removeItem('etape');
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
     * Charge les étapes non réservées du chantier sélectionné
     * Filtre pour n'afficher que les étapes disponibles (non réservées)
     * Sélectionne automatiquement la première étape si disponible
     */
    useEffect(() => {
        /**
         * Récupère les étapes du chantier et filtre pour ne garder que celles non réservées
         */
        async function fetchEtapes() {
            if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
            try {
                const response = await fetch(`/api/etapes?chantier=${numero_chantier}`);
                const data = await response.json();
                let datatrie;
                if (response.ok) {
                    // Filtre les étapes pour ne garder que celles qui ne sont pas réservées
                    // Seules les étapes non réservées peuvent recevoir un artisan
                    datatrie = data.filter((etape) => etape.reservee == false);
                    setEtapes(datatrie);
                    // Sélectionne automatiquement la première étape disponible pour faciliter l'utilisation
                    if (EtapeCourrante === null){
                        if (datatrie.length > 0) setEtapeCourrante(datatrie[0].id);
                    }
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchEtapes();
    }, [numero_chantier]); // Se déclenche à chaque changement de numero_chantier

    /**
     * Charge les artisans qualifiés pour l'étape sélectionnée
     * Se déclenche automatiquement quand une étape est sélectionnée
     * Sélectionne automatiquement le premier artisan si disponible
     */
    useEffect(() => {
        /**
         * Récupère les artisans qualifiés pour l'étape sélectionnée depuis l'API
         */
        async function fetchartisan() {
            if (!EtapeCourrante) return; // Ne fait rien si aucune étape n'est sélectionnée
            try {
                // Utilise un paramètre de requête pour filtrer par étape
                const response = await fetch(`/api/recup_artisan?etape=${EtapeCourrante}`);
                const data = await response.json();
                if (response.ok) {
                    setArtisans(data);
                    if (data.length > 0){
                        // Sélectionne automatiquement le premier artisan pour faciliter l'utilisation
                        setArtisanCourrant(data[0].noartisan);
                    }else{
                        // Aucun artisan qualifié disponible pour cette étape
                        setArtisanCourrant(undefined);
                    }
                } else {
                    setArtisans([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchartisan();
    }, [EtapeCourrante]); // Se déclenche à chaque changement de EtapeCourrante


    /**
     * Sauvegarde l'affectation de l'artisan à l'étape dans la base de données
     * Vérifie qu'une étape est sélectionnée avant de sauvegarder
     */
    const Sauvegarder = async () => {
        if (!EtapeCourrante) return; // Vérifie qu'une étape est bien sélectionnée

        try {
            const response = await fetch('/api/sauv_artisan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chantierId: numero_chantier,
                    etapeId: EtapeCourrante,
                    noartisan: ArtisanCourrant // Peut être undefined si aucun artisan n'est disponible
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
                    text: "Modification Sauvegardé",
                    confirmButtonText: 'OK'
                })
            }
        } catch (error) {
            console.error(error);
        }
    };

    
  return (
    <div className='artisan'>
        <div className='BulleArtisan'>
            <h1>Nouvelle Affectation</h1>

            <div className="form-grid">
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

                {numero_chantier && (
                    <>
                        <label className="full-width">
                            Nom Étape:
                            <select
                                value={EtapeCourrante} 
                                onChange={(e) => setEtapeCourrante(Number(e.target.value))}>
                                    {Etapes.map(etape => (
                                        <option key={etape.id} value={etape.id}>{ etape.id } - { etape.nom }</option>
                                    ))}
                            </select> 
                        </label>
                        
                        <hr />

                        <h1 className="full-width" style={{fontSize: '18px', marginTop: '10px'}}>Choix de l'artisan</h1>
                        
                        <div className="full-width">
                            {ArtisanCourrant !== undefined ? (
                                <label>
                                    Artisan disponible :
                                    <select
                                        value={ArtisanCourrant} 
                                        onChange={(e) => setArtisanCourrant(Number(e.target.value))}>
                                            {Artisans.map(artisan => (
                                                <option key={artisan.noartisan} value={artisan.noartisan}>
                                                    { artisan.nomartisan } - { artisan.prenomartisan }
                                                </option>
                                            ))}
                                    </select>
                                </label>
                            ) : (
                                <div className="no-data">Aucun artisan qualifié trouvé pour cette étape.</div>
                            )}
                        </div>
                    </>
                )}

                <button type="button" className='Valid' onClick={Sauvegarder}>
                    Enregistrer l'affectation
                </button>
            </div>

            {error && <p className="no-data">{error}</p>}
        </div>
    </div>
  )
}
