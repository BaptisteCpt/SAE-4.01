'use client' 

import "../css/commercialAccueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AccCommercial() { 

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

    function pageCliChan(){
        router.push('/creation_de_chantier')
    }

    function pageCli(){
        router.push('page_client')
    }
    return (
        <div className="bulle_accueil">
            <h1>{ nom }</h1> 
            
            <div className="boutons_accueil">
                <table>
                    <td>
                        <img src="/img/maison-icone.png" className="modeles-img" onClick={pageModele}/>
                        <button type="button" onClick={pageModele}>
                            Liste des modèles
                        </button>
                    </td>
                    <td>
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageCliChan}/>
                        <button type="button" onClick={pageCliChan}>
                            Crée un nouveau dossier
                        </button>
                    </td>
                    <td>
                        <img src="/img/client.png" className="clients-img" onClick={pageCli}/>
                        <button type="button" onClick={pageCli}>
                            Liste des Clients
                        </button>
                    </td>
                </table>
            </div>
        </div>
    )
} 