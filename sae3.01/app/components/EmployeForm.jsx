'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer';

export default function EmployeForm() {

    const [nom, setNom] = useState("");
    const router = useRouter();

    useEffect(() => {
        const nomStocke = localStorage.getItem("nom");
        if (nomStocke) {
            setNom(nomStocke);
        }
    }, []); 

    function pageCom(){
        router.push('/pageCommerciale')
    }

    function pageArti(){
        router.push('/pageArtisant')
    }

    function pageMOE(){
        router.push('/pageMoe')
    }

    function pageAdmin(){
        router.push('/pageAdmin')
    }

    return (
        <>
            <div className="bulle_accueil">
                <h1>Bienvenue { nom }</h1> 
                <div className="boutons_accueil">
                    <div className="bloc-accueil">
                        <img src="/img/maison-icone.png" onClick={pageCom} alt="Commercial" />
                        <button className="but" type="button" onClick={pageCom}>
                            Commercial(e)
                        </button>
                    </div>

                    <div className="bloc-accueil">
                        <img src="/img/dossier.png" onClick={pageArti} alt="Artisan" />
                        <button className="but" type="button" onClick={pageArti}>
                            Artisan
                        </button>
                    </div>

                    <div className="bloc-accueil">
                            <img src="/img/client.png" onClick={pageMOE} alt="Maitre d'oeuvre" />
                            <button className="but" type="button" onClick={pageMOE}>
                            Maitre D'oeuvre
                            </button>
                    </div>

                    <div className="bloc-accueil">
                            <img src="/img/client.png" onClick={pageAdmin} alt="Administrateur" />
                            <button className="but" type="button" onClick={pageAdmin}>
                            Administrateur
                            </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
