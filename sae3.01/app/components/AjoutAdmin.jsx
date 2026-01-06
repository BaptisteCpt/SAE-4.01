'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AjoutAdmin() {

    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [error, setError] = useState('')
    const [listeCom, setListeCom] = useState([]) 
    
    const router = useRouter()

    useEffect(() => {
    }, []);
    
    async function validerForm(e) {
        e.preventDefault();
        if (!prenom || !nom) {
            setError("Veuillez compléter tous les champs")
            return;
        }

        try {
            const res = await fetch('/api/cre_admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nom: nom, 
                    prenom: prenom 
                }),
            });

            if (res.ok) {
                router.push('/pageAdmin'); 
            } else {
                setError("Echec de l'ajout de l'administrateur");
            }

        } catch (err) {
            console.error(err);
            setError("Erreur Serveur");
        }
    }
    
    return (
        <div className="bulle">
            <h1>Ajouter un Administrateur</h1>

            <form>

                <label>Nouvel Administrateur :</label>
                <input type="text" className="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..."
                />
                
                <input type="text" className="prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                <button type="button" onClick={validerForm}>Valider</button>
            </form>
        </div>
    )
}