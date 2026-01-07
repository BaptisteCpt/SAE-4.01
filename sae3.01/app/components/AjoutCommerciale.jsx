'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2';
import Footer from '../components/Footer';

export default function AjoutCommerciale() {

    const [nomCom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    
    const router = useRouter()
    
    async function validerForm(e) {
        e.preventDefault();

        if (!prenom || !nomCom) {
            Swal.fire({
                title: 'Champs manquants',
                text: 'Veuillez compléter tous les champs',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
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
                await Swal.fire({
                    title: 'Succès !',
                    text: 'Le commercial a été ajouté avec succès.',
                    icon: 'success',
                    confirmButtonText: 'Super !'
                });
                router.push('/pageCommerciale'); 
            } else {
                const info = await res.json();
                Swal.fire({
                    title: 'Erreur',
                    text: info.error || "Échec de l'ajout du commercial",
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
                <h1>Ajouter un Commercial</h1>

                <form>
                    <label>Nom :</label>
                    <input type="text" className="nom" value={nomCom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />
                    
                    <label>Prénom :</label>
                    <input type="text" className="prenom" placeholder="Prénom..." value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    
                    <div className="form-buttons">
                        <button className="but" type="button" onClick={validerForm}>Valider</button>
                        <button className="but" type="button" onClick={() => router.back()}>Annuler</button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}
