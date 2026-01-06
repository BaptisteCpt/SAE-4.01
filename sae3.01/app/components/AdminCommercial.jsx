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
                <table>
                    <td>
                        <img src="/img/dossier.png" className="dossier-img"/>
                        <button className="but" type="button" onClick={pageAjoutCom}>
                            Ajout ou Modification d'un Commercial(e)
                        </button>
                    </td>
                    <td>
                        <img src="/img/client.png" className="clients-img" onClick={pageListeCom}/>
                        <button className="but" type="button" onClick={pageListeCom}>
                            Liste des Commerciaux
                        </button>
                    </td>
                </table>
            </div>
        </div>
    )
} 