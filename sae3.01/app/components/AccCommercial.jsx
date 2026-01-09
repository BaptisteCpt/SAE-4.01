'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour les commerciaux
 * Affiche un menu avec des boutons pour accéder aux différentes sections
 * @returns {JSX.Element} La page d'accueil commercial
 */
export default function AccCommercial() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    /**
     * Redirige vers la page de liste des modèles
     */
    function pageModele() {
        router.push('/page_model');
    }

    /**
     * Redirige vers la page de création de chantier
     */
    function pageCliChan(){
        router.push('/creation_de_chantier')
    }

    /**
     * Redirige vers la page de liste des clients
     */
    function pageCli(){
        router.push('page_client')
    }
    return (
    <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
        <div className="boutons_accueil">
            <div className="bloc-accueil">
                <img src="/img/maison-icone.png" onClick={pageModele} />
                <button className="but" type="button" onClick={pageModele}>
                    Liste des modèles
                </button>
            </div>

            <div className="bloc-accueil">
                <img src="/img/dossier.png" onClick={pageCliChan} />
                <button className="but" type="button" onClick={pageCliChan}>
                    Crée un nouveau dossier
                </button>
            </div>

            <div className="bloc-accueil">
                    <img src="/img/client.png" onClick={pageCli} />
                    <button className="but" type="button" onClick={pageCli}>
                    Liste des Clients
                    </button>
            </div>
        </div>
    </div>

    )
} 