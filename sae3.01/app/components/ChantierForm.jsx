'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import '../css/login.css'
import { useChantier } from '../../context/ChantierContext'

export default function ChantierForm() {

    const { data, setData} = useChantier();

    const[date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const[maitre_doeuvre, setMaitre_oeuvre] = useState(data.maitre_doeuvre || "");
    const[adresse_du_chantier, setAdresseDuChantier] = useState(data.adresse_du_chantier || "");
    const[villechantier, setVilleChantier] = useState(data.villeChantier || "");
    const[code_postal_chantier, setCodePostalChantier] = useState(data.code_postal_chantier || "");
    const[modele_maison, setModeleMaison] = useState(data.modele_maison || "");
    const[modeles, setModeles] = useState([]);

    const router = useRouter()
    const [error,setError] = useState()
    const [success,setSuccess] = useState(false)

    useEffect(() => {
        async function fetchModele(){
            try {
                const res =  await fetch('/api/modele');
                const model = await res.json();
                setModeles(model)
            } catch (err){
                console.error('Erreur lors de la récuperation des Modèles', err)
            }
        }

        fetchModele();
    }, []);

    async function finalise_chantier(){
            if(!date || maitre_doeuvre.trim() == 0 || adresse_du_chantier.trim() == 0 || villechantier.trim() == 0 || code_postal_chantier.trim() == 0 || !modele_maison){
                setError("Veuillez compléter les champs manquants");
                return;
            }
            try {
              const res = await fetch('/api/crea_chantier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({date, maitre_doeuvre, adresse_du_chantier, villechantier, code_postal_chantier, modele_maison}),
              });
          
              const info = await res.json();
          
              if (!res.ok) {
                setError(info.error || 'Erreur de connexion');
                return;
              }
    
              if (res.ok) {
                setData({ ...data, date, maitre_doeuvre, adresse_du_chantier, villechantier, code_postal_chantier, modele_maison});
                setSuccess(true);
              }
            } catch (err) {
              setError('Erreur Server');
            }
        }
    
        useEffect(() => {
                if (success) {
                  router.push("/accueil/page");
                }
              }, [success, router]);

  return (
    <div className='BulleDuFormulaire'>

        <h1>Création d'un Chantier</h1>

        <p>
            Information sur le Chantier :
        </p>
        <form>
            <input type="date" name="current_date" value={date} readOnly/>
            <br />

            <label>
                Maître d'oeuvre:
                <input type="text" name="maitre_doeuvre" value={maitre_doeuvre} onChange={(e) => setMaitre_oeuvre(e.target.value)}/>
            </label>
            <br />
            <label>
                Modèle de maison:
                <select name="modele_maison" value={modele_maison} onChange={e => setModeleMaison(e.target.value)}>
                        <option value="">-- Choisir un modèle --</option>
                            {modeles.map((modele) => (
                                <option key={modele.nomodele} value={modele.nommodele}>{modele.nommodele}</option>
                                ))}
                </select>
            </label>
            <br />
            <label>
                Adresse du Chantier:
                <input type="text" name="Adresse_du_chantier" value={adresse_du_chantier} onChange={(e) => setAdresseDuChantier(e.target.value)}/>
            </label>
            <br />
            <label>
                Ville:
                <input type="text" name="villechantier" value={villechantier} onChange={(e) => setVilleChantier(e.target.value)} />
            </label>
            <br />
            <label>
                Code Postal:
                <input type="text" name="Code_Postal_chantier" value={code_postal_chantier} onChange={(e)=> setCodePostalChantier(e.target.value)}/>
            </label>
            <br />
            <button type="button" onClick={finalise_chantier}>Finalisé la Création</button>
        </form>

        {error && <p>{error}</p>}


    </div>
  )
}