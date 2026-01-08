'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AdminAdmin() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageAjoutAdmin(){
        router.push('/pageAjoutAdmin')
    }

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
