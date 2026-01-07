'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Swal from 'sweetalert2';

export default function AjoutArtisan() {
    const [idSelectionne, setIdSelectionne] = useState("") 
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [adresse, setAdresse] = useState('')
    const [cp, setCp] = useState('')
    const [ville, setVille] = useState('')
    
    const [listeArti, setListeArti] = useState([])
    const [toutesLesEtapes, setToutesLesEtapes] = useState([])
    const [etapesSelectionnees, setEtapesSelectionnees] = useState([])
    const router = useRouter()
    
    async function getArti(){
        try{
            const res = await fetch('/api/recup_arti_bis');
            if(res.ok){
                const data = await res.json();
                setListeArti(data);
            }
        } catch(err){ console.error(err); }
    }

    useEffect(() => {
        getArti();
        async function fetchEtapes() {
            try {
                const res = await fetch('/api/recup_etapes');
                const data = await res.json();
                const etapesUniques = Array.from(new Map(data.map(item => [item.noetape, item])).values());
                setToutesLesEtapes(etapesUniques);
            } catch (err) {}
        }
        fetchEtapes();
    }, []);

    function Selectionner(e) {
        const id = e.target.value;
        setIdSelectionne(id);

        if (id === "") {
            setNom(""); setPrenom(""); setAdresse(""); setCp(""); setVille("");
            setEtapesSelectionnees([]);
        } else {
            const artisan = listeArti.find(a => a.noartisan === parseInt(id));
            if (artisan) {
                setNom(artisan.nomartisan || "");
                setPrenom(artisan.prenomartisan || "");
                setAdresse(artisan.adresseartisan || "");
                setCp(artisan.cpartisan || "");
                setVille(artisan.villeartisan || "");
                if (artisan.etre_qualifie_pour) {
                    const idsEtapes = artisan.etre_qualifie_pour.map(relation => relation.noetape);
                    setEtapesSelectionnees(idsEtapes);
                } else {
                    setEtapesSelectionnees([]);
                }
            }
        }
    }

    function caseCocher(idEtape) {
        if (etapesSelectionnees.includes(idEtape)) {
            setEtapesSelectionnees(prev => prev.filter(id => id !== idEtape));
        } else {
            setEtapesSelectionnees(prev => [...prev, idEtape]);
        }
    }

    async function validerForm(e) {
        e.preventDefault();

        if (!prenom || !nom || !cp) {
            Swal.fire({
                title: 'Champs manquants',
                text: "Veuillez compléter au moins Nom, Prénom et Code Postal",
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        const dataToSend = { 
            nom, prenom, adresse, cp, ville,
            etapes: etapesSelectionnees.map(id => Number(id))
        };

        try {
            let url = '/api/cre_artisant';
            let method = 'POST';
            let successMessage = "L'artisan a été créé avec succès.";

            if (idSelectionne) {
                url = '/api/maj_artisan';
                method = 'PUT';
                dataToSend.id = idSelectionne; 
                successMessage = "L'artisan a été modifié avec succès.";
            }

            const res = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSend),
            });

            if (res.ok) {
                await Swal.fire({
                    title: 'Succès !',
                    text: successMessage,
                    icon: 'success',
                    confirmButtonText: 'Parfait'
                });
                router.push('/pageArtisant');
            } else {
                const info = await res.json();
                Swal.fire({
                    title: 'Erreur',
                    text: info.error || "Une erreur est survenue lors de l'enregistrement",
                    icon: 'error',
                    confirmButtonText: 'Fermer'
                });
            }

        } catch (err) {
            console.error(err);
            Swal.fire({
                title: 'Erreur Serveur',
                text: "Impossible de contacter le serveur",
                icon: 'error',
                confirmButtonText: 'Fermer'
            });
        }
    }

    return (
        <div className="bulle">
            <h1>Gestion des Artisans</h1>
            <form>
                <label>Sélectionner un artisan (ou Nouveau) :</label>
                <select className="ArtisantListe" value={idSelectionne} onChange={Selectionner}>
                    <option value="">-- Créer un Nouveau Artisan --</option>
                    {listeArti.map((arti) => (
                        <option key={arti.noartisan} value={arti.noartisan}>
                            {arti.nomartisan} {arti.prenomartisan}
                        </option>
                    ))}
                </select>
                <h2>{idSelectionne ? "Modifier l'Artisan" : "Nouvel Artisan"}</h2>
                
                <div>
                    <input type="text" className="nom" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />
                    <input type="text" className="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom..." />
                    <input type="text" className="adresse" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse..." />
                    <input type="text" className="cp" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Code Postal..." />
                    <input type="text" className="ville" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ville..." />
                    
                    <label>Qualifications :</label>
                    <div>
                        {toutesLesEtapes.map((etape) => (
                            <div key={etape.noetape}>
                                <input type="checkbox" id={`etape-${etape.noetape}`} value={etape.noetape} checked={etapesSelectionnees.includes(etape.noetape)} onChange={() => caseCocher(etape.noetape)}/>
                                <label>{etape.nometape}</label>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={validerForm}> 
                        {idSelectionne ? "Enregistrer les modifications" : "Valider la création"}
                    </button>
                </div>
            </form>
        </div>
    )
}