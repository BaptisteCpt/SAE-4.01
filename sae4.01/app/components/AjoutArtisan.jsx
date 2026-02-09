'use client'

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Swal from 'sweetalert2';

/**
 * Composant pour ajouter ou modifier un artisan
 * Permet de créer un nouvel artisan ou de modifier un existant avec ses qualifications
 * @returns {JSX.Element} Le formulaire de gestion des artisans
 */
export default function AjoutArtisan() {
    const searchParams = useSearchParams();
    const [idSelectionne, setIdSelectionne] = useState(searchParams.get('id') || "") 
    const [nom, setNom] = useState('')
    const [prenom, setPrenom] = useState('')
    const [adresse, setAdresse] = useState('')
    const [cp, setCp] = useState('')
    const [ville, setVille] = useState('')
    
    const [listeArti, setListeArti] = useState([])
    const [toutesLesEtapes, setToutesLesEtapes] = useState([])
    const [etapesSelectionnees, setEtapesSelectionnees] = useState([])
    const router = useRouter()
    
    /**
     * Récupère la liste de tous les artisans depuis l'API
     */
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
                // Élimine les doublons en utilisant une Map avec noetape comme clé
                // Map garantit l'unicité des clés, puis on récupère les valeurs
                const etapesUniques = Array.from(new Map(data.map(item => [item.noetape, item])).values());
                setToutesLesEtapes(etapesUniques);
            } catch (err) {}
        }
        fetchEtapes();
    }, []);

    /**
     * Gère la sélection d'un artisan dans la liste déroulante
     * Charge les informations de l'artisan sélectionné dans le formulaire
     * @param {Event} e - L'événement de changement de sélection
     */
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
                // Extrait les IDs des étapes pour lesquelles l'artisan est qualifié
                // Utilise map pour transformer la relation en simple ID
                if (artisan.etre_qualifie_pour) {
                    const idsEtapes = artisan.etre_qualifie_pour.map(relation => relation.noetape);
                    setEtapesSelectionnees(idsEtapes);
                } else {
                    setEtapesSelectionnees([]);
                }
            }
        }
    }

    /**
     * Gère la sélection/désélection d'une étape (qualification) pour l'artisan
     * @param {number} idEtape - L'ID de l'étape à cocher/décocher
     */
    function caseCocher(idEtape) {
        if (etapesSelectionnees.includes(idEtape)) {
            setEtapesSelectionnees(prev => prev.filter(id => id !== idEtape));
        } else {
            setEtapesSelectionnees(prev => [...prev, idEtape]);
        }
    }

    /**
     * Valide et soumet le formulaire d'artisan
     * Crée un nouvel artisan ou met à jour un existant selon l'ID sélectionné
     * @param {Event} e - L'événement de soumission du formulaire
     */
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
        <>
            <div className="bulle">
                <h1>Gestion des Artisans</h1>
                <form>
                    <label>Sélectionner un artisan (ou Nouveau) :</label>
                    <select value={idSelectionne} onChange={Selectionner}>
                        <option value="">-- Créer un Nouvel Artisan --</option>
                        {listeArti.map((arti) => (
                            <option key={arti.noartisan} value={arti.noartisan}>
                                {arti.nomartisan} {arti.prenomartisan}
                            </option>
                        ))}
                    </select>
                    <h2>{idSelectionne ? "Modifier l'Artisan" : "Nouvel Artisan"}</h2>
                    
                    <label>Nom :</label>
                    <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom..." />
                    
                    <label>Prénom :</label>
                    <input type="text" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prénom..." />
                    
                    <label>Adresse :</label>
                    <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} placeholder="Adresse..." />
                    
                    <label>Code Postal :</label>
                    <input type="text" value={cp} onChange={(e) => setCp(e.target.value)} placeholder="Code Postal..." />
                    
                    <label>Ville :</label>
                    <input type="text" value={ville} onChange={(e) => setVille(e.target.value)} placeholder="Ville..." />
                    
                    <label>Qualifications :</label>
                    <div className="etapes-container">
                        {toutesLesEtapes.map((etape) => (
                            <div key={etape.noetape} className="etape-item" onClick={() => caseCocher(etape.noetape)} style={{cursor: 'pointer'}}>
                                <input type="checkbox" id={`etape-${etape.noetape}`} value={etape.noetape} checked={etapesSelectionnees.includes(etape.noetape)} readOnly style={{pointerEvents: 'none'}}/>
                                <span style={{marginLeft: '10px'}}>{etape.nometape}</span>
                            </div>
                        ))}
                    </div>
                    
                    <div className="form-buttons">
                        <button className="but" type="button" onClick={validerForm}> 
                            {idSelectionne ? "Enregistrer" : "Valider"}
                        </button>
                        <button className="but" type="button" onClick={() => router.back()}> 
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}
