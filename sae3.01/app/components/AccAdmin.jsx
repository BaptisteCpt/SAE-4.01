'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AccAdmin() { 

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageModele() {
        router.push('/page_model');
    }

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            
            <div className="boutons_accueil">
                <table>
                    <td>
                        <img src="/img/maison-icone.png" className="modeles-img"/>
                        <button className="but" type="button">
                            Liste des modèles
                        </button>
                    </td>
                    <td>
                        <img src="/img/dossier.png" className="dossier-img"/>
                        <button className="but" type="button">
                            Liste des chantiers
                        </button>
                    </td>
                    <td>
                        <img src="/img/client.png" className="clients-img"/>
                        <button className="but" type="button">
                            Liste des employés
                        </button>
                    </td>
                </table>
            </div>
        </div>
    )
} 