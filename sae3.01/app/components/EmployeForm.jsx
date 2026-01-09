'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Composant de page d'accueil pour la gestion des employés
 * Affiche un menu avec des boutons pour accéder à la gestion de chaque type d'employé
 * @returns {JSX.Element} La page d'accueil de gestion des employés
 */
export default function EmployeForm() {

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
     * Redirige vers la page de gestion des commerciaux
     */
    function pageCom(){
        router.push('/pageCommerciale')
    }

    /**
     * Redirige vers la page de gestion des artisans
     */
    function pageArti(){
        router.push('/pageArtisant')
    }

    /**
     * Redirige vers la page de gestion des maîtres d'œuvre
     */
    function pageMOE(){
        router.push('/pageMoe')
    }

    /**
     * Redirige vers la page de gestion des administrateurs
     */
    function pageAdmin(){
        router.push('/pageAdmin')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/maison-icone.png" onClick={pageCom} alt="Commercial" />
                        <button className="but" type="button" onClick={pageCom}>
                            Commercial(e)
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" onClick={pageArti} alt="Artisan" />
                        <button className="but" type="button" onClick={pageArti}>
                            Artisan
                        </button>
                    </div>

                    <div className="bloc-accueil">
                            <img src="/img/client.png" onClick={pageMOE} alt="Maître d'œuvre" />
                            <button className="but" type="button" onClick={pageMOE}>
                            Maître d'œuvre
                            </button>
                    </div>

                    <div className="bloc-accueil">
                            <img src="/img/client.png" onClick={pageAdmin} alt="Administrateur" />
                            <button className="but" type="button" onClick={pageAdmin}>
                            Administrateur
                            </button>
                    </div>
                </div>
            </div>
        </>
    )
}
