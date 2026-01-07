'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'

export default function AccMaitre() { 

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

    function pagePerso(){
         router.push('/personnalisation')
    }

    function pageSuivi(){
        router.push('/suivi')
    }

    function pageArti(){
         router.push('/artisan')
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
                    <img src="/img/dossier.png" onClick={pagePerso} />
                    <button className="but" type="button" onClick={pagePerso}>
                        Personnalisation des étapes
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/client.png" onClick={pageSuivi} />
                    <button className="but" type="button" onClick={pageSuivi}>
                        Suivi d'un Chantier
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/client.png" onClick={pageArti} />
                    <button className="but" type="button" onClick={pageArti}>
                        Affectation des artisant
                    </button>
                </div>
            </div>
        </div>
    )
} 