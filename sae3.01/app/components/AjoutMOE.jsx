'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2';

export default function AjoutMoe() {

    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [error, setError] = useState('')
    
    const router = useRouter()
    
    async function validerForm(e) {
        e.preventDefault();
        setError("");

        if (!prenom || !nom) {
            Swal.fire({
                title: 'Champs manquants',
                text: 'Veuillez compléter tous les champs',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
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
                await Swal.fire({
                    title: 'Succès !',
                    text: "Le maître d'œuvre a été ajouté avec succès.",
                    icon: 'success',
                    confirmButtonText: 'Super !'
                });
                router.push('/pageMoe'); 
            } else {
                const info = await res.json();
                Swal.fire({
                    title: 'Erreur',
                    text: info.error || "Échec de l'ajout du maître d'œuvre",
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                });
            }

        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Erreur Serveur',
                text: "Impossible de contacter le serveur",
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
        }
    }
    
    return (
        <>
            <div className="bulle">
                <h1>Ajouter un Maître d'Œuvre</h1>

                <form>
                    <label>Nom :</label>
                    <input type="text" className="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />
                    
                    <label>Prénom :</label>
                    <input type="text" className="prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    
                    <div className="form-buttons">
                        <button className="but" type="button" onClick={validerForm}>Valider</button>
                        <button className="but" type="button" onClick={() => router.back()}>Annuler</button>
                    </div>
                    {error && <p>{error}</p>}
                </form>
            </div>
        </>
    )
}
