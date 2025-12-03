'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import '../css/ListeMaquette.css' 

export default function PageModeles() {
    const [modeles, setModeles] = useState([]);     
    const router = useRouter();

    const imagesMap = {
        "Basique 1": "/img/modele1.png",
        "Standard 1": "/img/modele2.png",
        "Premium 1": "/img/modele3.png",
    }
    useEffect(() => {
        async function fetchModeles() {
            try {
                const res = await fetch('/api/modele_maison');
                if (res.ok) {
                    const info = await res.json();
                    if (Array.isArray(info)) setModeles(info);
                }
            } catch (err) {
                console.error(err);
            }
        }
        fetchModeles();
    }, [router]); 

    return (
        <div>
            <form className='model_form'></form>
            <div className="grille_img">
                {modeles.map((modele, index) => {
                    const nomNettoye = modele.nommodele ? modele.nommodele.trim() : "";
                    return (
                        <div key={index} className="img_modele">
                            <img 
                                src={imagesMap[nomNettoye] || "img/logo.png"} 
                                alt={nomNettoye} 
                                className="img-modele"
                            />
                            <div className="info-modele">
                                <h3>{nomNettoye}</h3>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}