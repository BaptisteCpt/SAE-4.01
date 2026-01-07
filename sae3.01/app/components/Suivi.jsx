'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../css/suivi.css';
import Swal from 'sweetalert2';

export default function Suivi() {

    const [Chantiers,setChantiers] = useState([]);
    const [Etapes,setEtapes] = useState([]);
    const[numero_chantier, setNumeroChantier] = useState();
    const [error,setError] = useState();
    const router = useRouter();


    useEffect(() => { // Chargement des chantier et récupérations dans la liste chantiers

        const reloadChantier = localStorage.getItem('chantierSelectionne');
        if (reloadChantier) {
            setNumeroChantier(reloadChantier);
            localStorage.removeItem('chantierSelectionne');
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

    useEffect(() => { // Chargement des étapes du chantier selectionner et récupération dans la liste etapes
        async function fetchEtapes() {
            if (!numero_chantier) return;
            try {
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
    }, [numero_chantier]);

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
        if (!res.ok) alert('Erreur date théorique : ' + result.error);
        } catch (err) {
        console.error(err);
        alert('Erreur réseau');
        }
    };

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
            if (!res.ok) alert('Erreur date début : ' + result.error);
            } catch (err) {
            console.error(err);
            alert('Erreur réseau');
            }
    };
    
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
                if (typeof window !== 'undefined') {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: "Vous ne pouvez pas entrer une date de fin si l'étape précédente n'est pas terminée",
                        confirmButtonText: 'OK'
                    }).then(() => {
                        localStorage.setItem('chantierSelectionne', numero_chantier);
                        window.location.reload();
                    });
                }
            }
            } catch (err) {
            console.error(err);
            alert('Erreur réseau sur date fin');
            }
    };

    const redirect = (etapeid,chantierid) => { // rediriger à l'affectation au click sur le bouton
        localStorage.setItem('chantier', chantierid);
        localStorage.setItem('etape', etapeid);
        router.push('/artisan');
    }

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
                <select value={numero_chantier} onChange={e => {setNumeroChantier(Number(e.target.value))}}>
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
                                Artisan : {etape.nomartisan ? `${etape.nomartisan} ${etape.prenomartisan}` : <button onClick={()=> redirect(etape.id,etape.idchantier)}>Affecter</button>}
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
