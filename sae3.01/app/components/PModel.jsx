'use client'

import React, { useEffect, useState } from 'react'
import '../css/ListeMaquette.css' 
const IMAGES_MAP = {
    "Basique 1": "/img/modele1.png",
    "Standard 1": "/img/modele2.png",
    "Premium 1": "/img/modele3.png",
}

export default function PageModeles() {

    const [modeles, setModeles] = useState([]);     
    const [etapes, setEtapes] = useState([]);

    useEffect(() => {
        async function chargerDonnees() {
            try {
                const [resModeles, resEtapes] = await Promise.all([
                    fetch('/api/modele_maison'),
                    fetch('/api/recup_etapes')
                ]);

                const dataModeles = await resModeles.json();
                const dataEtapes = await resEtapes.json();

                if (Array.isArray(dataModeles)) setModeles(dataModeles);
                if (Array.isArray(dataEtapes)) setEtapes(dataEtapes);

            } catch (err) {
                console.error("Erreur chargement :", err);
            }
        }
        chargerDonnees();
    }, []); 

    return (
        <div>
            <div className="grille_img">
                {modeles.map((modele, index) => {
                    const nom = modele.nommodele ? modele.nommodele.trim() : "Modèle Inconnu";
                    const steps = etapes
                        .filter(e => e.nomodele === modele.nomodele)
                        .sort((a, b) => a.noetape - b.noetape);

                    return (
                        <div key={modele.nomodele || index} className="img_modele">
                            <img 
                                src={IMAGES_MAP[nom] || "img/logo.png"} 
                                alt={nom} 
                                className="img_modele"
                            />
                            
                            <div className="info_modele">
                                <h3>{nom}</h3>
                                
                                <div className="listes_etapes">
                                    <h4>Étapes :</h4>
                                    
                                    {steps.length > 0 ? (
                                        <ul className="liste_etapes">
                                            {steps.map((etape) => (
                                                <li key={etape.noetape}>
                                                    <p>{etape.nometape}</p> 
                                                    {etape.nbjoursrealisation && 
                                                        <span className="duree_etape"> ({etape.nbjoursrealisation} jours)</span>
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Aucune étape définie.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}