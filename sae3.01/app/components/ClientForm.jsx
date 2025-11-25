'use client'

import React from 'react'
import {useState} from 'react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Image from 'next/image'
import { useChantier } from '../../context/ChantierContext'


export default function ClientForm() {

    const{data,setData} = useChantier(); // Ici je crée le stockage de toutes les données du formulaire

    // Après ici je fais des constante avec leur valeur et la methode pour les modifiers. 
    // En plus je dis que si il ya une valeur déjà enregister je l'utilise, sinon j'utilisse le vide
    // au cas ou la personne revient sur la page précédente c'est sauvegarder 

    const[nom, setNom] = useState(data.nom || "");
    const[prenom, setPrenom] = useState(data.prenom || "");
    const[adresse, setAdresse] = useState(data.adresse || "");
    const[ville, setVille] = useState(data.ville || "");
    const[code_postal, setCodePostal] = useState(data.code_postal || "");
    const router = useRouter()
    const [error,setError] = useState()
    const [success,setSuccess] = useState(false)

    // Cette fonction met a jour le "tableau" et verifie si tout les champs sont remplis avant de passer a la page suivante

    async function next_page(){
        if(nom.length == 0 || prenom.length == 0 || adresse.length == 0 || ville.length == 0 || code_postal.length == 0){
            setError("Veuillez compléter les champs manquants");
            return;
        }
        try {
          const res = await fetch('/api/cre_client', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({nom, prenom, adresse, ville, code_postal}),
          });
      
          const info = await res.json();
      
          if (!res.ok) {
            setError(info.error || 'Erreur de connexion');
            return;
          }

          if (res.ok) {
            setData({ ...data, nom,prenom,adresse,ville,code_postal});
            setSuccess(true);
          }
        } catch (err) {
          setError('Erreur Server');
        }
    }

    useEffect(() => {
            if (success) {
              router.push("/creation_de_chantier/crea_chantier");
            }
          }, [success, router]);

  return (
    <div className='BulleDuFormulaire'>
        <h1>Création d'un Chantier</h1>
        <p>
            Profil du Client
        </p>
        <form>
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
                Adresse:
                <input type="text" name="Adresse" placeholder="Adresse..."value={adresse} onChange={(e) => setAdresse(e.target.value)}/>
            </label>
            <br />
            <label>
                Ville:
                <input type="text" name="Ville" placeholder="Ville..." value={ville} onChange={(e) => setVille(e.target.value)}/>
            </label>
            <br />
            <label>
                Code Postal:
                <input type="text" name="CodePostal" placeholder="Code Postal..." value={code_postal} onChange={(e) => setCodePostal(e.target.value)}/>
            </label>
            <br />
            <button type="button" onClick={next_page}>Continuer</button>
        </form>
    </div>
  )
}