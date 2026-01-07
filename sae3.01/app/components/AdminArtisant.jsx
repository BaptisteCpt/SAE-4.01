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

    function pageAjoutArti(){
        router.push('/pageAjoutArti') 
    }

    function pageListeArti(){
        router.push('/pageListeArti')
    }

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            
            <div className="boutons_accueil">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutArti} alt="Ajout"/>
                                <button className="arti" type="button" onClick={pageAjoutArti}>
                                    Ajout d'un Artisan
                                </button>
                            </td>
                            <td>
                                <img src="/img/client.png" className="clients-img" onClick={pageListeArti} alt="Liste"/>
                                <button classNamae="arti" type="button" onClick={pageListeArti}>
                                    Liste des Artisans
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}