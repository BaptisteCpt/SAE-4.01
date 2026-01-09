'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour la gestion des maîtres d'œuvre
 * Affiche un menu avec des boutons pour ajouter ou lister les maîtres d'œuvre
 * @returns {JSX.Element} La page d'accueil de gestion des maîtres d'œuvre
 */
export default function AdminMaitre() { 

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
     * Redirige vers la page d'ajout d'un nouveau maître d'œuvre
     */
    function pageAjoutMoe(){
        router.push('/pageAjoutMoe')
    }

    /**
     * Redirige vers la page de liste des maîtres d'œuvre
     */
    function pageListeMoe(){
        router.push('/pageListeMoe')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutMoe} alt="Ajout"/>
                        <button className="but" type="button" onClick={pageAjoutMoe}>
                            Ajout d'un maître d'œuvre
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/client.png" className="clients-img" onClick={pageListeMoe} alt="Liste"/>
                        <button className="but" type="button" onClick={pageListeMoe}>
                            Liste des maîtres d'œuvre
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
