'use client' 

import "../css/accueil.css"; 
import { useState, useEffect } from 'react' 
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer';

export default function AdminMaitre() { 

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
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" className="dossier-img" onClick={pageAjoutMoe} alt="Ajout"/>
                        <button className="but" type="button" onClick={pageAjoutMoe}>
                            Ajout d'un Maitre d'oeuvre
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/client.png" className="clients-img" onClick={pageListeMoe} alt="Liste"/>
                        <button className="but" type="button" onClick={pageListeMoe}>
                            Liste des Maitres d'oeuvre
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
