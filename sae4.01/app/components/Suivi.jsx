'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../css/suivi.css';
import Swal from 'sweetalert2';

/**
 * Composant pour suivre l'avancement d'un chantier
 * Permet de définir les dates théoriques, de début et de fin pour chaque étape
 * @returns {JSX.Element} La page de suivi de chantier
 */
export default function Suivi() {

    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const [error,setError] = useState();
    const router = useRouter();


    /**
     * Charge la liste des chantiers au chargement du composant
     * Vérifie aussi si un chantier a été sauvegardé dans le localStorage (après rechargement)
     */
    useEffect(() => {
        // Récupère un chantier sauvegardé depuis une navigation précédente
        // Permet de restaurer la sélection après un rechargement de page
        const reloadChantier = localStorage.getItem('chantierSelectionne');
        if (reloadChantier) {
            setNumeroChantier(reloadChantier);
            // Supprime la valeur du localStorage après l'avoir utilisée (nettoyage)
            localStorage.removeItem('chantierSelectionne');
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
     * Charge les étapes du chantier sélectionné
     * Se déclenche automatiquement quand un chantier est sélectionné
     */
    useEffect(() => {
        /**
         * Récupère les étapes du chantier sélectionné depuis l'API
         */
        async function fetchEtapes() {
            if (!numero_chantier) return; // Ne fait rien si aucun chantier n'est sélectionné
            try {
                // Utilise un paramètre de requête pour filtrer par chantier
                const response = await fetch(`/api/etapes?chantier=${numero_chantier}`);
                const data = await response.json();
                if (response.ok) {
                    setEtapes(data);
                } else {
                    setEtapes([]);
                }
            } catch (err) { console.error(err); }
        }
        fetchEtapes();
    }, [numero_chantier]); // Se déclenche à chaque changement de numero_chantier

    /**
     * Sauvegarde la date de début théorique d'une étape
     * @param {string} date - La date théorique au format ISO
     * @param {number} etapeid - L'ID de l'étape
     */
    const saveTheo = async (date, etapeid) => {
        try {
        const res = await fetch('/api/sauv_datetheo', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
            chantierId: numero_chantier,
            etapeId: etapeid,
            dateTheo: date,
            }),
        });
    
        const result = await res.json();
        if (!res.ok){
            Swal.fire({
                icon: 'warning',
                title: 'Oops...',
                text: "Vous devez entrer une date théorique",
                confirmButtonText: 'OK'
            });
        }
        } catch (err) {
        console.error(err);
        alert('Erreur réseau');
        }
    };

    /**
     * Sauvegarde la date de début réelle d'une étape
     * @param {string} date - La date de début au format ISO
     * @param {number} etapeid - L'ID de l'étape
     */
    const saveDebut = async (date, etapeid) => {     
        try {
            const res = await fetch('/api/sauv_datedebut', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                chantierId: numero_chantier,
                etapeId: etapeid,
                dateDebut: date,
                }),
            });
        
            const result = await res.json();
            if (!res.ok){
                Swal.fire({
                    icon: 'warning',
                    title: 'Oops...',
                    text: "Vous devez entrer une date de début",
                    confirmButtonText: 'OK'
                });
            }
            } catch (err) {
            console.error(err);
            alert('Erreur réseau');
            }
    };
    
    /**
     * Sauvegarde la date de fin d'une étape
     * Vérifie que l'étape précédente est terminée avant d'autoriser la sauvegarde
     * @param {string} date - La date de fin au format ISO
     * @param {number} etapeid - L'ID de l'étape
     */
    const saveFin = async (date, etapeid) => {
        try {
            const res = await fetch('/api/sauv_datefin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                chantierId: numero_chantier,
                etapeId: etapeid,
                dateFin: date,
                }),
            });
        
            const result = await res.json();
            
            if (!res.ok) {
                // L'API retourne une erreur si l'étape précédente n'est pas terminée
                if (typeof window !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Vous ne pouvez pas entrer une date de fin si l'étape précédente n'est pas terminée",
                        confirmButtonText: 'OK'
                    }).then(() => {
                        // Sauvegarde le chantier pour le restaurer après rechargement
                        localStorage.setItem('chantierSelectionne', numero_chantier);
                        // Recharge la page pour afficher l'état actuel
                        window.location.reload();
                    });
                }
            }
            } catch (err) {
            console.error(err);
            alert('Erreur réseau sur date fin');
            }
    };

    /**
     * Redirige vers la page d'affectation d'artisan pour une étape spécifique
     * Sauvegarde le chantier et l'étape dans le localStorage pour les restaurer sur la page suivante
     * @param {number} etapeid - L'ID de l'étape
     * @param {number} chantierid - L'ID du chantier
     */
    const redirect = (etapeid,chantierid) => {
        // Sauvegarde les informations dans le localStorage pour les passer à la page suivante
        localStorage.setItem('chantier', chantierid);
        localStorage.setItem('etape', etapeid);
        router.push('/artisan');
    }

    /**
     * Valide et termine le suivi du chantier
     * Affiche un message de succès puis redirige vers l'accueil maître d'œuvre
     */
    const Valider = () =>{
        Swal.fire({
            icon: 'success',
            title: 'Réussi',
            text: "Suivi Sauvegardé",
            confirmButtonText: 'OK'
        }).then(() => {
            router.push('/accueil_maitre');
        });
    }

    return (
        <div className="liste_etapes">
            <h1>Suivi d'un chantier</h1>
            <label>
                Chantier Choisi :
                <select value={numero_chantier} onChange={e => {
                                        const selected = Number(e.target.value);
                                        localStorage.setItem('chantierSelectionne', selected);
                                        window.location.reload(); /* rafraîchit la page */}}>
                        <option value="" hidden>-- Numéro du chantier --</option>
                            {Chantiers.map((Chantier) => (
                                <option key={Chantier.nochantier} value={Chantier.nochantier}>{Chantier.nochantier} - {Chantier.adressechantier}</option>
                            ))}
                </select>            
            </label>
            {numero_chantier &&
                Etapes.map((etape) => (
                 <article className="etape" key={etape.id}>
                    <div className="etape-nom">{etape.nom}</div>
            
                    <div className="etape-dates">
                        <div>
                        <label>Début théorique</label>
                        <input
                            type="date"
                            defaultValue={etape.dateTheo ? etape.dateTheo.slice(0, 10) : ""}
                            onBlur={(e) => saveTheo(e.target.value,etape.id)}
                        />
                        </div>
            
                        <div>
                        <label>Début réel</label>
                        <input
                            type="date"
                            defaultValue={etape.dateDebut ? etape.dateDebut.slice(0, 10) : ""}
                            onBlur={(e) => saveDebut(e.target.value,etape.id)}
                        />
                        </div>
            
                        <div>
                        <label>Fin</label>
                        <input
                            type="date"
                            defaultValue={etape.dateFin ? etape.dateFin.slice(0, 10) : ""}
                            onBlur={(e) => saveFin(e.target.value,etape.id)}
                        />
                        </div>

                        <div>
                            <label>
                                
                                {etape.id !== 1 && (
                                    <div>
                                        <label>Artisan :</label>
                                        <br />

                                        {etape.nomartisan ? (
                                        <>
                                            {etape.nomartisan} {etape.prenomartisan}
                                            <button
                                            onClick={() => redirect(etape.id, etape.idchantier)}
                                            >
                                            Modifier
                                            </button>
                                        </>
                                        ) : (
                                        <button
                                            onClick={() => redirect(etape.id, etape.idchantier)}
                                        >
                                            Affecter
                                        </button>
                                        )}
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                 </article>
            ))}
        {
            numero_chantier &&
            <button onClick={Valider}>
                Valider
            </button>
        }
        {error && <p>{error}</p>}
      </div>
      
  )
}
