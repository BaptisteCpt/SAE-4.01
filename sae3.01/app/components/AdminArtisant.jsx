'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour la gestion des artisans
 * Affiche un menu avec des boutons pour ajouter ou lister les artisans
 * @returns {JSX.Element} La page d'accueil de gestion des artisans
 */
export default function AdminArtisant() { 

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
     * Redirige vers la page d'ajout d'un nouvel artisan
     */
    function pageAjoutArti(){
        router.push('/pageAjoutArti') 
    }

    /**
     * Redirige vers la page de liste des artisans
     */
    function pageListeArti(){
        router.push('/pageListeArti')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutArti} alt="Ajout"/>
                        <button className="but" type="button" onClick={pageAjoutArti}>
                            Ajout d'un Artisan
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/client.png" className="clients-img" onClick={pageListeArti} alt="Liste"/>
                        <button className="but" type="button" onClick={pageListeArti}>
                            Liste des Artisans
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
