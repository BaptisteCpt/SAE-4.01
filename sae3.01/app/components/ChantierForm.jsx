'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useChantier } from '../../context/ChantierContext'

export default function ChantierForm() {

    const { data } = useChantier();
    const router = useRouter();
    const searchParams = useSearchParams();
    const urlId = searchParams.get('client_id');
    let contextId = null;
    if (data && data.noclient) {
  
        if (typeof data.noclient !== 'function') {
            contextId = data.noclient;
        }
    }
    const clientID = urlId || contextId;
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [maitre_doeuvre, setMaitre_oeuvre] = useState(""); 
    const [adresse_du_chantier, setAdresseDuChantier] = useState(data?.adresse_du_chantier || "");
    const [villechantier, setVilleChantier] = useState(data?.villeChantier || "");
    const [code_postal_chantier, setCodePostalChantier] = useState(data?.code_postal_chantier || "");
    const [modele_maison, setModeleMaison] = useState(data?.modele_maison || "");
    const [modeles, setModeles] = useState([]);
    const [liste_oeuvre, setListeMaitre] = useState([]); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const [resMaitre, resModele] = await Promise.all([
                    fetch('/api/liste_maitre'),
                    fetch('/api/modele_maison')
                ]);

                const maitres = await resMaitre.json();
                const modelesData = await resModele.json();

                if (Array.isArray(maitres)) setListeMaitre(maitres);
                if (Array.isArray(modelesData)) setModeles(modelesData);
            } catch (err) {
                console.error("Erreur chargement données:", err);
            }
        }
        fetchData();
    }, []);


 
    async function finalise_chantier() {
        setError(null);
        if (!date || !maitre_doeuvre || !modele_maison || adresse_du_chantier.trim() === "" || villechantier.trim() === "" || code_postal_chantier.trim() === "") {
            setError("Veuillez compléter tous les champs manquants");
            return;
        }
        if (!clientID) {
            setError("Erreur : Aucun client n'est associé. Veuillez retourner à la liste des clients.");
            return;
        }

        try {
            const res = await fetch('/api/crea_chantier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date,
                    maitre_doeuvre,
                    modele_maison,
                    adresse_du_chantier,
                    villechantier,
                    code_postal_chantier,
                    noclient: clientID 
                }),
            });

            const info = await res.json();

            if (!res.ok) {
                setError(info.error || 'Erreur de connexion');
            } else {
                setSuccess(true);
            }
        } catch (err) {
            setError('Erreur Serveur');
        }
    }


    useEffect(() => {
        if (success) {
            router.push("/accueil_commerciale"); 
        }
    }, [success, router]);

    return (
        <div className='BulleDuFormulaire'>
            <h1>Création d'un Chantier</h1>
            <p>Information sur le Chantier :</p>

            <form>
                <input type="date" name="current_date" value={date} readOnly />
                <br />

                <label>
                    Maître d'oeuvre:
                    <select name="maitre_doeuvre" value={maitre_doeuvre} onChange={e => setMaitre_oeuvre(e.target.value)}>
                        <option value="" hidden>Choisir un maître d'oeuvre</option>
                        {liste_oeuvre.map((maitre, index) => (
                            <option key={index} value={maitre.nomoe}>
                                {maitre.nommoe} {maitre.prenommoe}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <label>
                    Modèle de maison:
                    <select name="modele_maison" value={modele_maison} onChange={e => setModeleMaison(e.target.value)}>
                        <option value="" hidden>Choisir un modèle</option>
                        {modeles.map((modele, index) => (
                            <option key={index} value={modele.nomodele}>
                                {modele.nommodele}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <label>
                    Adresse du Chantier:
                    <input type="text" placeholder="Adresse..." value={adresse_du_chantier} onChange={(e) => setAdresseDuChantier(e.target.value)} />
                </label>
                <br />

                <label>
                    Ville:
                    <input type="text" placeholder="Ville..." value={villechantier} onChange={(e) => setVilleChantier(e.target.value)} />
                </label>
                <br />

                <label>
                    Code Postal:
                    <input type="text" placeholder="Code Postal..." value={code_postal_chantier} onChange={(e) => setCodePostalChantier(e.target.value)} />
                </label>
                <br />

                <button type="button" onClick={finalise_chantier}>Finaliser la Création</button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </div>
    )
}