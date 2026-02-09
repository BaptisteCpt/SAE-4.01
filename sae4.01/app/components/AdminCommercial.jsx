'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour la gestion des commerciaux
 * Affiche un menu avec des boutons pour ajouter ou lister les commerciaux
 * @returns {JSX.Element} La page d'accueil de gestion des commerciaux
 */
export default function AdminCommercial() { 

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
     * Redirige vers la page d'ajout d'un nouveau commercial
     */
    function pageAjoutCom(){
        router.push('/pageAjoutCom') 
    }

    /**
     * Redirige vers la page de liste des commerciaux
     */
    function pageListeCom(){
        router.push('/pageListeCom')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutCom} alt="Ajout"/>
                        <button className="but" type="button" onClick={pageAjoutCom}>
                            Ajout d'un Commercial(e)
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/client.png" className="clients-img" onClick={pageListeCom} alt="Liste"/>
                        <button className="but" type="button" onClick={pageListeCom}>
                            Liste des Commerciaux
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
