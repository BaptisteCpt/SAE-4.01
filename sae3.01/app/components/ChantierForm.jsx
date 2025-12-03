    'use client'

    import React, {useState, useEffect} from 'react'
    import { useRouter } from 'next/navigation'
    import { useChantier } from '../../context/ChantierContext'

export default function ChantierForm() {
    // Initialisation des constantes et leurs setter
    const { data, setData} = useChantier();

        const[date, setDate] = useState(new Date().toISOString().split('T')[0]);

        const[maitre_doeuvre, setMaitre_oeuvre] = useState(""); 
        const[adresse_du_chantier, setAdresseDuChantier] = useState(data.adresse_du_chantier || "");
        const[villechantier, setVilleChantier] = useState(data.villeChantier || "");
        const[code_postal_chantier, setCodePostalChantier] = useState(data.code_postal_chantier || "");
        const[modele_maison, setModeleMaison] = useState(data.modele_maison || "");
        
        const[modeles, setModeles] = useState([]);
        const [liste_oeuvre, setListeMaitre] = useState([]); 

        const router = useRouter()
        const [error,setError] = useState()
        const [success,setSuccess] = useState(false)

    // Au chargement de la page, on récupère tout les maitres d'oeuvres et modèles de maisons existants que l'on enregistre dans les tableaux liste_oeuvre et modeles
    useEffect(() => {
        async function fetchMaitre(){
            try {
                const res2 = await fetch('/api/liste_maitre'); 
                const info2 = await res2.json();
                if (Array.isArray(info2)) setListeMaitre(info2);
            } catch (err){ console.error(err); }
        }
        fetchMaitre();
    }, []);

        useEffect(() => {
            async function fetchModeles(){
                try {
                    const res = await fetch('/api/modele_maison'); 
                    const info = await res.json();
                    if (Array.isArray(info)) setModeles(info); 
                } catch (err){ console.error(err); }
            }
            fetchModeles();
        }, []);

    // Vérification que tout les champs obligatoire sont bien rempli et enregistrement dans la base de données 
    async function finalise_chantier(){

                if(!date || !maitre_doeuvre || !modele_maison || adresse_du_chantier.length === 0 || villechantier.length === 0 || code_postal_chantier.length === 0){
                    setError("Veuillez compléter les champs manquants");
                    return;
                }

                if (!data.noclient) {
                    setError("Erreur : Aucun client sélectionné.");
                    return;
                }

            try {
              const res = await fetch('/api/crea_chantier', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date, 
                    maitre_doeuvre, 
                    modele_maison,
                    adresse_du_chantier, 
                    villechantier, 
                    code_postal_chantier,
                    noclient: data.noclient
                }),
              });
          
              const info = await res.json();
          
              if (!res.ok) {
                setError(info.error || 'Erreur de connexion');
                return;
              }
    
              if (res.ok) {
                setSuccess(true);
              }
            } catch (err) {
              setError('Erreur Server');
            }
        }
        
        // au chargement de la page, si succès est à true on redirige sur la prochaine page
        useEffect(() => {
            if (success) {
                router.push("../accueil");
            }
        }, [success, router]);

    return (
        <div className='BulleDuFormulaire'>
            <h1>Création d'un Chantier</h1>
            <p>Information sur le Chantier :</p>

            <form>
                <input type="date" name="current_date" value={date} readOnly/>
                <br />

                <label>
                    Maître d'oeuvre:
                    <select name="maitre_doeuvre" value={maitre_doeuvre} onChange={e => setMaitre_oeuvre(e.target.value)}>
                    <option value="" hidden>Choisir un maître d'oeuvre</option>
                    {liste_oeuvre.map((maitre) => (
                        <option key={maitre.nomoe} value={maitre.nomoe}>
                            {maitre.nommoe} {maitre.prenommoe}
                        </option>
                    ))}
                    </select>
                </label>
                <br />

                <label>
                    Modèle de maison:
                    <select name="modele_maison" value={modele_maison} onChange={e => setModeleMaison(e.target.value)}>
                        <option value="" hidden>Choisir un modèle</option>
                        {modeles.map((modele) => (
                            <option key={modele.nomodele} value={modele.nomodele}>
                                {modele.nommodele}
                            </option>
                        ))}
                    </select>
                </label>
                <br />

                <label>
                    Adresse du Chantier:
                    <input type="text" placeholder="Adresse..." value={adresse_du_chantier} onChange={(e) => setAdresseDuChantier(e.target.value)}/>
                </label>
                <br />

                <label>
                    Ville:
                    <input type="text" placeholder="Ville..." value={villechantier} onChange={(e) => setVilleChantier(e.target.value)} />
                </label>
                <br />

                <label>
                    Code Postal:
                    <input type="text" placeholder="Code Postal..." value={code_postal_chantier} onChange={(e)=> setCodePostalChantier(e.target.value)}/>
                </label>
                <br />

                <button type="button" onClick={finalise_chantier}>Finaliser la Création</button>
            </form>
            
            {error && <p>{error}</p>}
        </div>
    )
    }