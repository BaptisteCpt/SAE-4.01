'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AjoutCommerciale() {

    const [nomCom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [error, setError] = useState('')
    const [listeCom, setListeCom] = useState([]) 
    
    const router = useRouter()

    async function getCom(){
        try{
            const res = await fetch('/api/recup_commerciale');
            const data = await res.json();
            
            if(res.ok){
                setListeCom(data);
            } else {
                console.error("Erreur récupération");
            }
        }
        catch(err){
            console.error(err);
            setError("Erreur Serveur");
        }
    }

    useEffect(() => {
        getCom();
    }, []);
    
    async function validerForm(e) {
        e.preventDefault();
        if (!prenom || !nomCom) {
            setError("Veuillez compléter tous les champs")
            return;
        }

        try {
            const res = await fetch('/api/cre_commercial', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    nom: nomCom, 
                    prenom: prenom 
                }),
            });

            if (res.ok) {
                router.push('/pageCommerciale'); 
            } else {
                setError("Echec de l'ajout du commercial(e)");
            }

        } catch (err) {
            console.error(err);
            setError("Erreur Serveur");
        }
    }
    
    return (
        <div className="bulle">
            <h1>Ajouter un Commercial</h1>

            <form>
                <label>Liste des commerciaux existants :</label>
                <select name="liste_commerciale" className="CommercialeListe" defaultValue="">
                    <option value="" disabled>-- Voir les commerciaux existants --</option>
                    {Array.isArray(listeCom) && listeCom.map((com) => (
                        <option key={com.id} value={com.id}>
                            {com.login}
                        </option>
                    ))}
                </select>
                <br/>

                <label>Nouveau Commercial :</label>
                <input type="text" className="nom" value={nomCom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..."
                />
                
                <input type="text" className="prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                <button type="button" onClick={validerForm}>Valider</button>
            </form>
        </div>
    )
}