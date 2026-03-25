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

    function pageModele() { router.push('/page_model'); }
    function pagePerso()  { router.push('/personnalisation'); }
    function pageSuivi()  { router.push('/suivi'); }
    function pageArti()   { router.push('/artisan'); }
    function pageAppel()  { router.push('/appel'); }
   async function exporterCSV() {
    try {
        const loginMoe = localStorage.getItem("nom"); 

        if (!loginMoe) {
            alert("Erreur : Impossible de trouver votre identifiant.");
            return;
        }
        const response = await fetch(`/api/export_artisans?login=${loginMoe}`); 
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || "Erreur lors de l'export");
      const headers = ["No Artisan;Nom Artisan;Prénom Artisan;No Chantier;Client;Adresse du Chantier;Étapes Associées à l'artisan;Prix total"];
        const rows = data.map(row => {
            return [
                `"${row.noartisan}"`, 
                `"${row.nom}"`, 
                `"${row.prenom}"`, 
                `"${row.nochantier}"`, 
                `"${row.client}"`, 
                `"${row.adresse}"`, 
                `"${row.etapes}"`,
                `"${row.prixTotalArtisan}"`
            ].join(";");
        });
        
        const csvContent = [headers, ...rows].join("\n");
        const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([BOM, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.setAttribute("href", url);
        element.setAttribute("download", "liste_chantiers_artisans_complet.csv");
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);

    } catch (err) { 
        console.error("Erreur lors de l'export :", err); 
        alert("Une erreur est survenue lors de la création du fichier CSV.");
    }
}

    return (
        <div className="bulle_accueil">
            <h1>Bienvenue { nom }</h1> 
            <div className="boutons_accueil">
                <div className="bloc-accueil">
                    <img src="/img/maison-icone.png" onClick={pageModele} alt="Modèles" />
                    <button className="but" type="button" onClick={pageModele}>
                        Liste des modèles
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/dossier.png" onClick={pagePerso} alt="Personnalisation" />
                    <button className="but" type="button" onClick={pagePerso}>
                        Personnalisation des étapes
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/calendrier.png" onClick={pageSuivi} alt="Suivi" />
                    <button className="but" type="button" onClick={pageSuivi}>
                        Suivi d'un Chantier
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/client.png" onClick={pageArti} alt="Artisans" />
                    <button className="but" type="button" onClick={pageArti}>
                        Affectation des artisans
                    </button>
                </div>

                <div className="bloc-accueil">
                    <img src="/img/money.png" onClick={pageAppel} alt="Appel de fonds" />
                    <button className="but" type="button" onClick={pageAppel}>
                        Appel de fonds
                    </button>
                </div>
            </div>
            <div className="boutonCSV">
                <button className="but" type="button" onClick={exporterCSV}>
                    Exporter la liste des artisans (CSV)
                </button>
            </div>
        </div>
    )
}