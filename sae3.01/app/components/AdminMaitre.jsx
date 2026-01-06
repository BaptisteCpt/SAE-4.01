'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AdminMaire() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageAjoutMoe(){
        router.push('/pageAjoutMoe')
    }

    function pageListeMoe(){
        router.push('/pageListeMoe')
    }

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            
            <div className="boutons_accueil">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutMoe} alt="Ajout"/>
                                <button className="but" type="button" onClick={pageAjoutMoe}>
                                    Ajout d'un Maitre d'oeuvre
                                </button>
                            </td>
                            <td>
                                <img src="/img/client.png" className="clients-img" onClick={pageListeMoe} alt="Liste"/>
                                <button className="but" type="button" onClick={pageListeMoe}>
                                    Liste des Maitres d'oeuvre
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}