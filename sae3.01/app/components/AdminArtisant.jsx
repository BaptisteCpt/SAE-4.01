'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AdminArtisant() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageAjoutArtisant(){
        router.push('/pageAjoutArti')
    }

    function pageListeArtisant(){
        router.push('/pageListeArti')
    }

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            
            <div className="boutons_accueil">
                <table>
                    <td>
                        <img src="/img/dossier.png" className="dossier-img"/>
                        <button className="but" type="button" onClick={pageAjoutArtisant}>
                            Ajout ou Modification d'un Artisant(e)
                        </button>
                    </td>
                    <td>
                        <img src="/img/client.png" className="clients-img" onClick={pageListeArtisant}/>
                        <button className="but" type="button" onClick={pageListeArtisant}>
                            Liste des Artisants
                        </button>
                    </td>
                </table>
            </div>
        </div>
    )
} 