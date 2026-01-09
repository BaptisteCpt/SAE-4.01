'use client'

import React, { useEffect, useState } from 'react'
import '../css/pmodel.css' 
const IMAGES_MAP = {
    "Basique 1": "/img/modele1.png",
    "Standard 1": "/img/modele2.png",
    "Premium 1": "/img/modele3.png",
}

/**
 * Composant pour afficher le catalogue des modèles de maison
 * Affiche chaque modèle avec son image et la liste de ses étapes de construction
 * @returns {JSX.Element} La page de catalogue des modèles
 */
export default function PageModeles() {

    const [modeles, setModeles] = useState([]);     
    const [etapes, setEtapes] = useState([]);

    /**
     * Charge les modèles et les étapes au chargement du composant
     * Utilise Promise.all pour charger les deux listes en parallèle (optimisation)
     */
    useEffect(() => {
        /**
         * Récupère les modèles et les étapes depuis l'API en parallèle
         */
        async function chargerDonnees() {
            try {
                // Charge les deux listes simultanément pour améliorer les performances
                const [resModeles, resEtapes] = await Promise.all([
                    fetch('/api/modele_maison'),
                    fetch('/api/recup_etapes')
                ]);

                const dataModeles = await resModeles.json();
                const dataEtapes = await resEtapes.json();

                // Vérifie que les données sont bien des tableaux avant de les utiliser
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
            <h1>Catalogue Des Modèles</h1>
            <div className="grille_img">
                {modeles.map((modele, index) => {
                    // Nettoie le nom du modèle (supprime les espaces) ou utilise un nom par défaut
                    const nom = modele.nommodele ? modele.nommodele.trim() : "Modèle Inconnu";
                    // Filtre les étapes pour ne garder que celles du modèle actuel
                    // Puis les trie par numéro d'étape croissant pour un affichage ordonné
                    const steps = etapes
                        .filter(e => e.nomodele === modele.nomodele) // Filtre par modèle
                        .sort((a, b) => a.noetape - b.noetape); // Trie par numéro d'étape

                    return (
                        <div key={modele.nomodele || index} className="img_modele">
                            <img 
                                src={IMAGES_MAP[nom] || "/img/logo.png"} 
                                alt={nom}
                            />
                            
                            <div className="info_modele">
                                <h3>{nom}</h3>
                                
                                <div className="listes_etapes">
                                    <h4>Étapes :</h4>
                                    
                                    {steps.length > 0 ? (
                                        <ul className="liste_etapes">
                                            {steps.map((etape) => (
                                                <li key={etape.noetape}>
                                                    <span>{etape.nometape}</span> 
                                                    {etape.nbjoursrealisation && 
                                                        <span className="duree_etape"> ({etape.nbjoursrealisation} jours)</span>
                                                    }
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p style={{color: '#2c3e50'}}>Aucune étape définie.</p>
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