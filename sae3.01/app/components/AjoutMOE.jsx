'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AjoutMoe() {

    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [error, setError] = useState('')
    const [listeMoe, setListeMoe] = useState([]) 
    
    const router = useRouter()

    useEffect(() => {
    }, []);
    
    async function validerForm(e) {
        e.preventDefault();
        setError("");

        if (!prenom || !nom) {
            setError("Veuillez compléter tous les champs")
            return;
        }

        try {
            const res = await fetch('/api/cre_moe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nom: nom, 
                    prenom: prenom,
                }),
            });

            if (res.ok) {
                router.push('/pageMoe'); 
            } else {
                const info = await res.json();
                setError(info.error || "Echec de l'ajout du Maitre d'oeuvre");
            }

        } catch (err) {
            console.error(err);
            setError("Erreur Serveur");
        }
    }
    
    return (
        <div className="bulle">
            <h1>Ajouter un Maitre d'Oeuvre</h1>

            <form>
                <label>Nouveau Maitre d'oeuvre :</label>
                <input type="text" className="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />
                
                <input type="text" className="prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                
                <button type="button" onClick={validerForm}>Valider</button>
            </form>
        </div>
    )
}