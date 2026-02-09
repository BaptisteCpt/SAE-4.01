'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour la gestion des administrateurs
 * Affiche un menu avec des boutons pour ajouter ou lister les administrateurs
 * @returns {JSX.Element} La page d'accueil de gestion des administrateurs
 */
export default function AdminAdmin() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    /**
     * Récupère le nom de l'utilisateur depuis le localStorage au chargement du composant
     */
    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    /**
     * Redirige vers la page d'ajout d'un nouvel administrateur
     */
    function pageAjoutAdmin(){
        router.push('/pageAjoutAdmin')
    }

    /**
     * Redirige vers la page de liste des administrateurs
     */
    function pageListeAdmin(){
        router.push('/pageListeAdmin')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutAdmin} alt="Dossier"/>
                        <button className="but" type="button" onClick={pageAjoutAdmin}>
                            Ajout d'un Administrateur
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/client.png" className="clients-img" onClick={pageListeAdmin} alt="Client"/>
                        <button className="but" type="button" onClick={pageListeAdmin}>
                            Liste des Administrateurs
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
