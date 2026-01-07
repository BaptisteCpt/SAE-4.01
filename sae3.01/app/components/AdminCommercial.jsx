'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AdminCommercial() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageAjoutCom(){
        router.push('/pageAjoutCom') 
    }

    function pageListeCom(){
        router.push('/pageListeCom')
    }

    return (
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
    )
}
